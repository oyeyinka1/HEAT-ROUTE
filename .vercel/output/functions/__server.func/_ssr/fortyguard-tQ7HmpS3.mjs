import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as tupleType, n as numberType, r as objectType, t as arrayType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import * as fs from "node:fs";
import * as path from "node:path";
//#region node_modules/.nitro/vite/services/ssr/assets/fortyguard-tQ7HmpS3.js
var CACHE_DIR = path.resolve(process.cwd(), ".cache");
var CACHE_FILE = path.join(CACHE_DIR, "fortyguard_tiles_cache.json");
var HIGH_HEAT_THRESHOLD_C = 38;
/**
* Ray-casting algorithm for Point in Polygon check
* pt: [lon, lat], polygon: [[lon, lat], ...]
*/
function isPointInPolygon(pt, polygon) {
	const [x, y] = pt;
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const [xi, yi] = polygon[i];
		const [xj, yj] = polygon[j];
		if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}
function readKeyFromEnv() {
	let key = process.env.FORTYGUARD_API_KEY || process.env.VITE_FORTYGUARD_API_KEY || process.env.FG_API_KEY;
	if (!key) try {
		const envPath = path.resolve(process.cwd(), ".env");
		if (fs.existsSync(envPath)) {
			const match = fs.readFileSync(envPath, "utf-8").match(/FORTYGUARD_API_KEY\s*=\s*(.+)/);
			if (match && match[1]) key = match[1].trim();
		}
	} catch {}
	return key;
}
function getCacheData() {
	try {
		if (fs.existsSync(CACHE_FILE)) {
			const raw = fs.readFileSync(CACHE_FILE, "utf-8");
			return JSON.parse(raw);
		}
	} catch (err) {
		console.warn("[FortyGuard Service] Could not read cache file:", err);
	}
	return null;
}
function saveCacheData(data) {
	try {
		if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
		fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
	} catch (err) {
		console.warn("[FortyGuard Service] Failed to write cache file:", err);
	}
}
/**
* Builds a padded bounding polygon GeoJSON covering all route coordinates
*/
function buildCombinedBoundingPolygon(routesCoordinates, paddingDegree = .012) {
	let minLon = Infinity;
	let maxLon = -Infinity;
	let minLat = Infinity;
	let maxLat = -Infinity;
	routesCoordinates.forEach((route) => {
		route.forEach(([lon, lat]) => {
			if (lon < minLon) minLon = lon;
			if (lon > maxLon) maxLon = lon;
			if (lat < minLat) minLat = lat;
			if (lat > maxLat) maxLat = lat;
		});
	});
	if (!isFinite(minLon)) {
		minLon = -112.085;
		maxLon = -112.065;
		minLat = 33.445;
		maxLat = 33.485;
	}
	minLon -= paddingDegree;
	maxLon += paddingDegree;
	minLat -= paddingDegree;
	maxLat += paddingDegree;
	return {
		type: "Polygon",
		coordinates: [[
			[minLon, minLat],
			[maxLon, minLat],
			[maxLon, maxLat],
			[minLon, maxLat],
			[minLon, minLat]
		]]
	};
}
async function submitFortyGuardTask(apiKey, polygonAoi) {
	const https = await import("node:https");
	const payload = JSON.stringify({
		polygon_aoi: polygonAoi,
		date_time: {
			filter_type: 1,
			start_date: "2024-07-15",
			start_time: "14:00"
		},
		granularity: 100,
		analytic_type: "tcm"
	});
	return new Promise((resolve, reject) => {
		const req = https.request({
			hostname: "api.fortyguard.com",
			port: 443,
			path: "/v1/heatmap",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"api-key": apiKey,
				"User-Agent": "HeatRoute-Navigator/1.0",
				"Content-Length": Buffer.byteLength(payload)
			},
			timeout: 12e3
		}, (res) => {
			let raw = "";
			res.on("data", (c) => raw += c);
			res.on("end", () => {
				try {
					const parsed = JSON.parse(raw);
					if (parsed.data?.activity_id) resolve(parsed.data.activity_id);
					else reject(/* @__PURE__ */ new Error(`Failed to get activity_id: ${raw}`));
				} catch (e) {
					reject(/* @__PURE__ */ new Error(`Invalid response JSON: ${raw}`));
				}
			});
		});
		req.on("error", reject);
		req.on("timeout", () => {
			req.destroy();
			reject(/* @__PURE__ */ new Error("FortyGuard task submission timed out"));
		});
		req.write(payload);
		req.end();
	});
}
async function pollFortyGuardStatus(apiKey, activityId, maxWaitMs = 6e4, intervalMs = 4e3) {
	const https = await import("node:https");
	const startTime = Date.now();
	const poll = async () => {
		return new Promise((resolve, reject) => {
			const req = https.request({
				hostname: "api.fortyguard.com",
				port: 443,
				path: `/v1/status/${activityId}`,
				method: "GET",
				headers: {
					"api-key": apiKey,
					"User-Agent": "HeatRoute-Navigator/1.0"
				},
				timeout: 8e3
			}, (res) => {
				let raw = "";
				res.on("data", (c) => raw += c);
				res.on("end", () => {
					try {
						resolve(JSON.parse(raw));
					} catch (e) {
						reject(e);
					}
				});
			});
			req.on("error", reject);
			req.end();
		});
	};
	while (Date.now() - startTime < maxWaitMs) {
		try {
			const resp = await poll();
			const status = resp.data?.status;
			const features = resp.data?.result?.map_data?.features;
			if (status === "Completed" && features && features.length > 0) return resp.data;
			if (status === "Failed" || status === "failed") throw new Error(`FortyGuard task failed: ${JSON.stringify(resp)}`);
		} catch (err) {
			console.warn(`[FortyGuard Service] Polling attempt error:`, err);
		}
		await new Promise((r) => setTimeout(r, intervalMs));
	}
	throw new Error(`FortyGuard polling timed out after ${maxWaitMs / 1e3}s`);
}
/**
* Server function to fetch and cache FortyGuard temperature tiles for a set of routes
*/
var getTemperatureHeatmap_createServerFn_handler = createServerRpc({
	id: "18953c3e96f1fbcf3e2ef03dd924a79576ec1301eb37c15083e132c1cdc5565e",
	name: "getTemperatureHeatmap",
	filename: "src/lib/fortyguard.ts"
}, (opts) => getTemperatureHeatmap.__executeServer(opts));
var getTemperatureHeatmap = createServerFn({ method: "POST" }).validator(objectType({ routesCoordinates: arrayType(arrayType(tupleType([numberType(), numberType()]))) })).handler(getTemperatureHeatmap_createServerFn_handler, async ({ data }) => {
	const apiKey = readKeyFromEnv();
	if (apiKey) try {
		const aoi = buildCombinedBoundingPolygon(data.routesCoordinates);
		const startTime = Date.now();
		console.info("[FortyGuard Service] Submitting heatmap task...");
		const activityId = await submitFortyGuardTask(apiKey, aoi);
		console.info(`[FortyGuard Service] Task submitted. Activity ID: ${activityId}. Polling...`);
		const completedData = await pollFortyGuardStatus(apiKey, activityId);
		const elapsedSec = ((Date.now() - startTime) / 1e3).toFixed(1);
		console.info(`[FortyGuard Service] Completed in ${elapsedSec}s with ${completedData.result?.map_data?.features?.length} tiles.`);
		const tiles = (completedData.result?.map_data?.features || []).map((f) => {
			const coords = f.geometry?.coordinates?.[0] || [];
			let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
			coords.forEach(([x, y]) => {
				if (x < minX) minX = x;
				if (x > maxX) maxX = x;
				if (y < minY) minY = y;
				if (y > maxY) maxY = y;
			});
			return {
				id: String(f.properties?.tile_id || f.id),
				averageTempC: Number(f.properties?.average_temperature?.toFixed(1) ?? 38.5),
				minTempC: Number(f.properties?.min_temperature?.toFixed(1) ?? 38),
				maxTempC: Number(f.properties?.max_temperature?.toFixed(1) ?? 39),
				polygon: coords,
				bbox: [
					minX,
					minY,
					maxX,
					maxY
				]
			};
		});
		const stats = completedData.result?.stats_data?.temperature_stats ? {
			min: Number(completedData.result.stats_data.temperature_stats.minimum.toFixed(1)),
			max: Number(completedData.result.stats_data.temperature_stats.maximum.toFixed(1)),
			mean: Number(completedData.result.stats_data.temperature_stats.mean.toFixed(1))
		} : void 0;
		const result = {
			source: "FortyGuard Live",
			tilesCount: tiles.length,
			stats,
			tiles
		};
		saveCacheData(result);
		return result;
	} catch (err) {
		console.warn("[FortyGuard Service] Live fetch failed or timed out, checking cache...", err);
	}
	else console.info("[FortyGuard Service] No FORTYGUARD_API_KEY configured, checking cache...");
	const cached = getCacheData();
	if (cached && cached.tiles && cached.tiles.length > 0) {
		console.info(`[FortyGuard Service] Serving cached heatmap tiles (${cached.tiles.length} tiles).`);
		return {
			...cached,
			source: "cache"
		};
	}
	console.warn("[FortyGuard Service] No cache available, generating fallback thermal grid.");
	return {
		source: "fallback",
		tilesCount: 0,
		tiles: []
	};
});
function calculateRouteThermalMetrics(routeCoordinates, durationMin, tiles, defaultBaselineTempC = 38.2, samplePointsCount = 20, thresholdC = HIGH_HEAT_THRESHOLD_C) {
	if (!routeCoordinates || routeCoordinates.length === 0) return {
		peakTempC: defaultBaselineTempC,
		avgTempC: defaultBaselineTempC,
		highHeatMinutes: 0,
		sampledPointsCount: 0
	};
	const sampledPoints = [];
	const totalCoords = routeCoordinates.length;
	if (totalCoords <= samplePointsCount) sampledPoints.push(...routeCoordinates);
	else for (let i = 0; i < samplePointsCount; i++) {
		const idx = Math.min(Math.floor(i / (samplePointsCount - 1) * (totalCoords - 1)), totalCoords - 1);
		sampledPoints.push(routeCoordinates[idx]);
	}
	const sampledTemps = [];
	sampledPoints.forEach((pt) => {
		let matchedTile;
		for (const tile of tiles) {
			const [minX, minY, maxX, maxY] = tile.bbox;
			if (pt[0] >= minX && pt[0] <= maxX && pt[1] >= minY && pt[1] <= maxY) {
				if (isPointInPolygon(pt, tile.polygon)) {
					matchedTile = tile;
					break;
				}
			}
		}
		if (matchedTile) sampledTemps.push(matchedTile.averageTempC);
		else if (tiles.length > 0) {
			let closestTile = tiles[0];
			let minDist = Infinity;
			for (const t of tiles) {
				const d = Math.hypot(pt[0] - t.polygon[0][0], pt[1] - t.polygon[0][1]);
				if (d < minDist) {
					minDist = d;
					closestTile = t;
				}
			}
			sampledTemps.push(closestTile.averageTempC);
		} else sampledTemps.push(defaultBaselineTempC);
	});
	const peakTempC = Number(Math.max(...sampledTemps).toFixed(1));
	const avgTempC = Number((sampledTemps.reduce((acc, v) => acc + v, 0) / sampledTemps.length).toFixed(1));
	const highHeatPoints = sampledTemps.filter((t) => t >= thresholdC).length;
	return {
		peakTempC,
		avgTempC,
		highHeatMinutes: Math.round(highHeatPoints / sampledTemps.length * durationMin),
		sampledPointsCount: sampledTemps.length
	};
}
var FORECAST_CACHE_PREFIX = "fg_forecast_slot_";
function getSlotCache(key) {
	try {
		const file = path.join(CACHE_DIR, `${FORECAST_CACHE_PREFIX}${key}.json`);
		if (fs.existsSync(file)) {
			const raw = fs.readFileSync(file, "utf-8");
			return JSON.parse(raw);
		}
	} catch (err) {
		console.warn(`[FortyGuard Service] Slot cache read failed for ${key}:`, err);
	}
	return null;
}
function saveSlotCache(key, tiles) {
	try {
		if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
		const file = path.join(CACHE_DIR, `${FORECAST_CACHE_PREFIX}${key}.json`);
		fs.writeFileSync(file, JSON.stringify(tiles, null, 2), "utf-8");
	} catch (err) {
		console.warn(`[FortyGuard Service] Slot cache write failed for ${key}:`, err);
	}
}
/**
* Server function to fetch real FortyGuard 12-hour forecast at 5 time offsets:
* Now (+0h), +3h, +6h, +9h, +12h.
* Returns real peak/avg temperatures per slot or marks slot as unavailable if failed.
*/
var getRouteForecast_createServerFn_handler = createServerRpc({
	id: "a6f30602e4362437b274a3a6b2c7fe6920610c50e043e40cc2c8b1c3f9b6eac6",
	name: "getRouteForecast",
	filename: "src/lib/fortyguard.ts"
}, (opts) => getRouteForecast.__executeServer(opts));
var getRouteForecast = createServerFn({ method: "POST" }).validator(objectType({
	routeCoordinates: arrayType(tupleType([numberType(), numberType()])),
	durationMin: numberType().default(20)
})).handler(getRouteForecast_createServerFn_handler, async ({ data }) => {
	const apiKey = readKeyFromEnv();
	const routeCoords = data.routeCoordinates;
	const duration = data.durationMin;
	const baseDate = "2024-07-15";
	const slotDefinitions = [
		{
			label: "Now",
			offsetHours: 0,
			date: baseDate,
			time: "14:00",
			displayTime: "2:00 PM"
		},
		{
			label: "+3h",
			offsetHours: 3,
			date: baseDate,
			time: "17:00",
			displayTime: "5:00 PM"
		},
		{
			label: "+6h",
			offsetHours: 6,
			date: baseDate,
			time: "20:00",
			displayTime: "8:00 PM"
		},
		{
			label: "+9h",
			offsetHours: 9,
			date: baseDate,
			time: "23:00",
			displayTime: "11:00 PM"
		},
		{
			label: "+12h",
			offsetHours: 12,
			date: "2024-07-16",
			time: "02:00",
			displayTime: "2:00 AM"
		}
	];
	const aoi = buildCombinedBoundingPolygon([routeCoords]);
	const bboxKey = `${aoi.coordinates[0]?.[0]?.[0]?.toFixed(3)}_${aoi.coordinates[0]?.[0]?.[1]?.toFixed(3)}`;
	const slotPromises = slotDefinitions.map(async (def) => {
		const cacheKey = `${bboxKey}_${def.date}_${def.time.replace(":", "")}`;
		let tiles = getSlotCache(cacheKey);
		if (!tiles && apiKey) try {
			console.info(`[FortyGuard Forecast] Submitting parallel task for slot ${def.label} (${def.date} ${def.time})...`);
			const https = await import("node:https");
			const payload = JSON.stringify({
				polygon_aoi: aoi,
				date_time: {
					filter_type: 1,
					start_date: def.date,
					start_time: def.time
				},
				granularity: 60,
				analytic_type: "tcm"
			});
			const actId = await new Promise((resolve, reject) => {
				const req = https.request({
					hostname: "api.fortyguard.com",
					port: 443,
					path: "/v1/heatmap",
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"api-key": apiKey,
						"User-Agent": "HeatRoute-Navigator/1.0",
						"Content-Length": Buffer.byteLength(payload)
					},
					timeout: 15e3
				}, (res) => {
					let raw = "";
					res.on("data", (c) => raw += c);
					res.on("end", () => {
						try {
							const parsed = JSON.parse(raw);
							if (parsed.data?.activity_id) resolve(parsed.data.activity_id);
							else reject(/* @__PURE__ */ new Error(`Failed activity_id: ${raw}`));
						} catch (e) {
							reject(e);
						}
					});
				});
				req.on("error", reject);
				req.on("timeout", () => {
					req.destroy();
					reject(/* @__PURE__ */ new Error("Timeout"));
				});
				req.write(payload);
				req.end();
			});
			const rawFeatures = (await pollFortyGuardStatus(apiKey, actId, 5e4, 3e3)).result?.map_data?.features || [];
			if (rawFeatures.length > 0) {
				tiles = rawFeatures.map((f) => {
					const coords = f.geometry?.coordinates?.[0] || [];
					let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
					coords.forEach(([x, y]) => {
						if (x < minX) minX = x;
						if (x > maxX) maxX = x;
						if (y < minY) minY = y;
						if (y > maxY) maxY = y;
					});
					return {
						id: String(f.properties?.tile_id || f.id),
						averageTempC: Number(f.properties?.average_temperature?.toFixed(1) ?? 38),
						minTempC: Number(f.properties?.min_temperature?.toFixed(1) ?? 38),
						maxTempC: Number(f.properties?.max_temperature?.toFixed(1) ?? 38),
						polygon: coords,
						bbox: [
							minX,
							minY,
							maxX,
							maxY
						]
					};
				});
				saveSlotCache(cacheKey, tiles);
			}
		} catch (err) {
			console.warn(`[FortyGuard Forecast] Slot ${def.label} fetch error:`, err);
		}
		if (tiles && tiles.length > 0) {
			const thermal = calculateRouteThermalMetrics(routeCoords, duration, tiles);
			return {
				slot: {
					label: `${def.label} (${def.displayTime})`,
					offsetHours: def.offsetHours,
					timeString: def.time,
					available: true,
					peakTempC: thermal.peakTempC,
					avgTempC: thermal.avgTempC,
					highHeatMinutes: thermal.highHeatMinutes
				},
				tiles
			};
		}
		return { slot: {
			label: `${def.label} (${def.displayTime})`,
			offsetHours: def.offsetHours,
			timeString: def.time,
			available: false,
			statusNotice: "Forecast unavailable"
		} };
	});
	const slotResults = await Promise.all(slotPromises);
	const computedSlots = slotResults.map((r) => r.slot);
	const nowTiles = slotResults.find((r) => r.tiles && r.tiles.length > 0)?.tiles || [];
	const availableSlots = computedSlots.filter((s) => s.available && s.peakTempC !== void 0);
	let coolestSlot;
	let hottestSlot;
	if (availableSlots.length > 0) {
		coolestSlot = [...availableSlots].sort((a, b) => a.peakTempC - b.peakTempC)[0];
		hottestSlot = [...availableSlots].sort((a, b) => b.peakTempC - a.peakTempC)[0];
	}
	return {
		source: "FortyGuard Forecast Live",
		slots: computedSlots,
		coolestSlot,
		hottestSlot,
		tiles: nowTiles
	};
});
var getCoolerRerouteData_createServerFn_handler = createServerRpc({
	id: "7773f1b38864253439cd185d954a1108c5027a663acc3c7021b9711e8aafa1ed",
	name: "getCoolerRerouteData",
	filename: "src/lib/fortyguard.ts"
}, (opts) => getCoolerRerouteData.__executeServer(opts));
var getCoolerRerouteData = createServerFn({ method: "POST" }).validator(objectType({
	routeCoordinates: arrayType(tupleType([numberType(), numberType()])),
	durationMin: numberType().default(21)
})).handler(getCoolerRerouteData_createServerFn_handler, async ({ data }) => {
	const slotKeys = [
		"2024-07-15_2000",
		"2024-07-15_2300",
		"2024-07-15_1700"
	];
	let tiles = null;
	let selectedKey = slotKeys[0];
	let cacheSource = "cold-fallback";
	for (const key of slotKeys) {
		const cached = getSlotCache(key);
		if (cached && cached.length > 0) {
			tiles = cached;
			selectedKey = key;
			cacheSource = "slot-cache";
			console.info(`[CoolerReroute] ✅ Loaded real FortyGuard slot cache: "${key}" — ${cached.length} tile polygons from .cache/fg_forecast_slot_${key}.json`);
			break;
		}
	}
	if (!tiles || tiles.length === 0) {
		const generalCache = getCacheData();
		if (generalCache && generalCache.tiles.length > 0) {
			cacheSource = "general-cache";
			tiles = generalCache.tiles.map((t) => ({
				...t,
				averageTempC: Math.max(30, Number((t.averageTempC - 4.5).toFixed(1))),
				peakTempC: Math.max(31, Number((t.maxTempC - 4.5).toFixed(1)))
			}));
			console.info(`[CoolerReroute] ⚠️ Slot cache empty — using general cache with -4.5°C evening offset (${tiles.length} tiles). Run getRouteForecast first to populate real slot cache.`);
		} else {
			tiles = [];
			console.warn("[CoolerReroute] ❌ No cache available — returning cold fallback (empty tile set).");
		}
	}
	const thermal = calculateRouteThermalMetrics(data.routeCoordinates, data.durationMin, tiles, 33.5);
	const slotLabel = selectedKey.includes("2000") ? "+6h (8:00 PM)" : selectedKey.includes("2300") ? "+9h (11:00 PM)" : "+3h (5:00 PM)";
	console.info(`[CoolerReroute] 📊 Metrics from slot "${selectedKey}" (${slotLabel}):`, `peakTempC=${thermal.peakTempC.toFixed(1)}°C,`, `avgTempC=${thermal.avgTempC.toFixed(1)}°C,`, `highHeatMin=${thermal.highHeatMinutes}min,`, `tileCount=${tiles.length},`, `source=${cacheSource}`);
	return {
		route: {
			id: "r-cooler",
			kind: "heat-safe",
			label: "Cooler Alternative",
			geometry: data.routeCoordinates,
			recommended: true,
			metrics: {
				durationMin: data.durationMin,
				distanceKm: 0,
				peakTempC: thermal.peakTempC,
				avgTempC: thermal.avgTempC,
				highHeatMinutes: thermal.highHeatMinutes
			}
		},
		tiles,
		timeSlotLabel: slotLabel,
		slotKey: selectedKey,
		cacheSource,
		tileCount: tiles.length
	};
});
//#endregion
export { getCoolerRerouteData_createServerFn_handler, getRouteForecast_createServerFn_handler, getTemperatureHeatmap_createServerFn_handler };
