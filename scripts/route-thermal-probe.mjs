import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function readEnv() {
  const envPath = path.join(ROOT, ".env");
  const raw = fs.readFileSync(envPath, "utf-8");
  const ors = raw.match(/OPENROUTESERVICE_API_KEY\s*=\s*(.+)/)?.[1]?.trim();
  const fg = raw.match(/FORTYGUARD_API_KEY\s*=\s*(.+)/)?.[1]?.trim();
  if (!ors) throw new Error("Missing OPENROUTESERVICE_API_KEY");
  if (!fg) throw new Error("Missing FORTYGUARD_API_KEY");
  return { ors, fg };
}

function httpsRequest(opts, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request({ timeout: 20000, ...opts }, (res) => {
      let raw = "";
      res.on("data", (c) => (raw += c));
      res.on("end", () => { try { resolve(JSON.parse(raw)); } catch { reject(new Error(`Non-JSON (${res.statusCode}): ${raw.slice(0,200)}`)); } });
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
    if (body) req.write(body);
    req.end();
  });
}

async function getRoutes(orsKey, start, end) {
  const payload = JSON.stringify({ coordinates: [start, end], alternative_routes: { target_count: 2, weight_factor: 1.6, share_factor: 0.6 }, instructions: false });
  const data = await httpsRequest({ hostname: "api.openrouteservice.org", port: 443, path: "/v2/directions/foot-walking/geojson", method: "POST", headers: { Authorization: orsKey, "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload), "User-Agent": "HeatRoute-Probe/1.0", Accept: "application/json" } }, payload);
  return (data.features ?? []).map((f, i) => ({ index: i, durationMin: Math.round((f.properties?.summary?.duration ?? 0) / 60), distanceKm: Number(((f.properties?.summary?.distance ?? 0) / 1000).toFixed(2)), coordinates: (f.geometry?.coordinates ?? []) }));
}

function buildPolygon(coordsList, pad = 0.015) {
  let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
  coordsList.flat().forEach(([lon, lat]) => { if (lon < minLon) minLon = lon; if (lon > maxLon) maxLon = lon; if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat; });
  return { type: "Polygon", coordinates: [[[minLon-pad,minLat-pad],[maxLon+pad,minLat-pad],[maxLon+pad,maxLat+pad],[minLon-pad,maxLat+pad],[minLon-pad,minLat-pad]]] };
}

async function submitHeatmap(fgKey, polygon) {
  const payload = JSON.stringify({ polygon_aoi: polygon, date_time: { filter_type: 1, start_date: "2024-07-15", start_time: "14:00" }, granularity: 100, analytic_type: "tcm" });
  const data = await httpsRequest({ hostname: "api.fortyguard.com", port: 443, path: "/v1/heatmap", method: "POST", headers: { "Content-Type": "application/json", "api-key": fgKey, "User-Agent": "HeatRoute-Probe/1.0", "Content-Length": Buffer.byteLength(payload) } }, payload);
  const id = data.data?.activity_id;
  if (!id) throw new Error(`No activity_id: ${JSON.stringify(data).slice(0,200)}`);
  return id;
}

async function pollHeatmap(fgKey, activityId, maxMs = 180000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    await new Promise(r => setTimeout(r, 6000));
    const data = await httpsRequest({ hostname: "api.fortyguard.com", port: 443, path: `/v1/status/${activityId}`, method: "GET", headers: { "api-key": fgKey, "User-Agent": "HeatRoute-Probe/1.0" } });
    const status = data.data?.status;
    const features = data.data?.result?.map_data?.features;
    if (status === "Completed" && features?.length > 0) return { features, stats: data.data?.result?.stats_data?.temperature_stats };
    if (status === "Failed") throw new Error("FortyGuard task Failed");
    process.stdout.write(".");
  }
  throw new Error("FortyGuard polling timed out");
}

function pip(pt, ring) {
  const [x, y] = pt; let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]; const [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function buildTiles(features) {
  return features.map(f => {
    const ring = f.geometry?.coordinates?.[0] ?? [];
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    ring.forEach(([x,y]) => { if(x<minX)minX=x; if(x>maxX)maxX=x; if(y<minY)minY=y; if(y>maxY)maxY=y; });
    return { avg: f.properties?.average_temperature ?? 39.5, ring, bbox: [minX,minY,maxX,maxY] };
  });
}

function sampleRoute(coords, durationMin, tiles, threshC = 38.0, n = 30) {
  const pts = [];
  for (let i = 0; i < n; i++) { const idx = Math.min(Math.floor((i/(n-1))*(coords.length-1)), coords.length-1); pts.push(coords[idx]); }
  const temps = pts.map(pt => {
    for (const t of tiles) { const [minX,minY,maxX,maxY] = t.bbox; if (pt[0]>=minX&&pt[0]<=maxX&&pt[1]>=minY&&pt[1]<=maxY&&pip(pt,t.ring)) return t.avg; }
    let best = tiles[0], bestD = Infinity;
    for (const t of tiles) { const cx=(t.bbox[0]+t.bbox[2])/2,cy=(t.bbox[1]+t.bbox[3])/2,d=Math.hypot(pt[0]-cx,pt[1]-cy); if(d<bestD){bestD=d;best=t;} }
    return best?.avg ?? 39.5;
  });
  return { peak: Number(Math.max(...temps).toFixed(2)), avg: Number((temps.reduce((a,b)=>a+b,0)/temps.length).toFixed(2)), highHeat: Math.round((temps.filter(t=>t>=threshC).length/temps.length)*durationMin) };
}

async function runPair(label, start, end, keys) {
  console.log(`\n${"=".repeat(60)}\nPAIR: ${label}\n  Start: [${start}]  End: [${end}]`);
  process.stdout.write("  [ORS] Fetching routes... ");
  const routes = await getRoutes(keys.ors, start, end);
  console.log(`got ${routes.length} route(s).`);
  if (!routes.length) { console.log("  !! No routes — skip."); return null; }
  const polygon = buildPolygon(routes.map(r => r.coordinates));
  process.stdout.write("  [FG]  Submitting heatmap... ");
  const actId = await submitHeatmap(keys.fg, polygon);
  console.log(`activity_id=${actId}`);
  process.stdout.write("  [FG]  Polling");
  const { features, stats } = await pollHeatmap(keys.fg, actId);
  console.log(` done. ${features.length} tiles.`);
  const tiles = buildTiles(features);
  console.log(`  FG area stats: min=${stats?.minimum?.toFixed(2)} max=${stats?.maximum?.toFixed(2)} mean=${stats?.mean?.toFixed(2)}`);
  const results = routes.map((r,i) => { const th = sampleRoute(r.coordinates, r.durationMin, tiles); return {...r,...th}; });
  results.forEach(r => {
    console.log(`\n  Route ${r.index} (${r.durationMin} min, ${r.distanceKm} km)`);
    console.log(`    peakTempC       : ${r.peak}°C`);
    console.log(`    avgTempC        : ${r.avg}°C`);
    console.log(`    highHeatMinutes : ${r.highHeat} min  (>=38°C)`);
  });
  if (results.length >= 2) {
    const [r0,r1] = results;
    const pd = Math.abs(r0.peak-r1.peak).toFixed(2), ad = Math.abs(r0.avg-r1.avg).toFixed(2), hd = Math.abs(r0.highHeat-r1.highHeat);
    console.log(`\n  >>> Peak diff: ${pd}°C | Avg diff: ${ad}°C | HighHeat diff: ${hd} min | Meaningful: ${(Number(pd)>=0.15||Number(ad)>=0.15||hd>=1) ? "YES ✓" : "NO"}`);
    return { label, peakDiff: Number(pd), avgDiff: Number(ad), heatDiff: hd };
  }
  return { label, peakDiff: 0, avgDiff: 0, heatDiff: 0 };
}

async function main() {
  const keys = readEnv();
  const DOWNTOWN = [-112.074, 33.4484];
  const pairs = [
    { label: "Downtown → Encanto Park interior [-112.0820, 33.4790]", start: DOWNTOWN, end: [-112.0820, 33.4790] },
    { label: "Downtown → Margaret T. Hance Park [-112.0755, 33.4640]", start: DOWNTOWN, end: [-112.0755, 33.4640] },
    { label: "Downtown → Arizona Falls / Grand Canal [-112.0333, 33.4820]", start: DOWNTOWN, end: [-112.0333, 33.4820] },
  ];
  const summaries = [];
  for (const p of pairs) {
    try { const s = await runPair(p.label, p.start, p.end, keys); if (s) summaries.push(s); }
    catch (err) { console.error(`\n  !! ERROR for "${p.label}":`, err.message); }
  }
  console.log(`\n${"=".repeat(60)}\nFINAL RANKING — by avg temp contrast:`);
  summaries.sort((a,b) => b.avgDiff - a.avgDiff).forEach((s,i) => console.log(`  ${i+1}. ${s.label}\n     peak=${s.peakDiff}°C | avg=${s.avgDiff}°C | highHeat=${s.heatDiff} min`));
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
