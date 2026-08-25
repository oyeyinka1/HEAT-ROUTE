import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { NavStep } from "./heatroute-data";

// Fallback high-fidelity walking route geometries from Downtown Phoenix [-112.0740, 33.4484]
// to Encanto Park [-112.0796, 33.4772] via actual Phoenix streets (1st Ave / Central Ave & 3rd Ave).
const FALLBACK_PHOENIX_ROUTES: [number, number][][] = [
  // Route 1 (Primary / Central & 1st Ave corridor)
  [
    [-112.074, 33.4484],
    [-112.074, 33.451],
    [-112.0741, 33.4552],
    [-112.0741, 33.4601],
    [-112.0742, 33.4655],
    [-112.0743, 33.471],
    [-112.0743, 33.475],
    [-112.0775, 33.4751],
    [-112.0796, 33.4751],
    [-112.0796, 33.4772],
  ],
  // Route 2 (Alternative / 3rd Ave shaded residential corridor)
  [
    [-112.074, 33.4484],
    [-112.0765, 33.4484],
    [-112.0772, 33.4525],
    [-112.0772, 33.458],
    [-112.0773, 33.4635],
    [-112.0774, 33.4695],
    [-112.0775, 33.4745],
    [-112.0796, 33.4745],
    [-112.0796, 33.4772],
  ],
];

export const DEFAULT_PHOENIX_NAV_STEPS: NavStep[] = [
  { instruction: "Head north on N Central Ave", detail: "Main arterial corridor", inMeters: 400 },
  { instruction: "Turn left onto W Roosevelt St", detail: "Tree-lined pedestrian street", inMeters: 350 },
  { instruction: "Turn right onto N 3rd Ave", detail: "Canopy-shaded residential sidewalk", inMeters: 600 },
  { instruction: "Continue onto Encanto Blvd path", detail: "Park entrance greenway", inMeters: 250 },
  { instruction: "Arrive at Encanto Park", detail: "Destination, Phoenix, AZ", inMeters: 100 },
];

export type RoutingSource = "OpenRouteService" | "OSM fallback" | "hardcoded fail-safe" | "none";

export interface DirectionsResult {
  source: RoutingSource;
  routes: Array<{
    coordinates: [number, number][]; // [lon, lat]
    distanceMeters?: number;
    durationSeconds?: number;
    steps?: NavStep[];
  }>;
  notice?: string;
  error?: string;
}

async function fetchOrsDirections(
  apiKey: string,
  start: [number, number],
  end: [number, number],
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const https = await import("node:https");
    const payload = JSON.stringify({
      coordinates: [start, end],
      alternative_routes: {
        target_count: 2,
        share_factor: 0.8,
        weight_factor: 1.6,
      },
    });

    const req = https.request(
      {
        hostname: "api.openrouteservice.org",
        port: 443,
        path: "/v2/directions/foot-walking/geojson",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
          Authorization: apiKey,
          "User-Agent": "HeatRoute-Navigator/1.0",
          "Content-Length": Buffer.byteLength(payload),
        },
        timeout: 10000,
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(raw));
            } catch (err) {
              reject(err);
            }
          } else {
            reject(new Error(`ORS returned ${res.statusCode}: ${raw}`));
          }
        });
      },
    );

    req.on("error", (err) => reject(err));
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("ORS request timed out"));
    });

    req.write(payload);
    req.end();
  });
}

export const getWalkingRoutes = createServerFn({ method: "POST" })
  .validator(
    z.object({
      start: z.tuple([z.number(), z.number()]), // [lon, lat]
      end: z.tuple([z.number(), z.number()]), // [lon, lat]
    }),
  )
  .handler(async ({ data }): Promise<DirectionsResult> => {
    let apiKey =
      (typeof process !== "undefined" && process.env
        ? process.env.OPENROUTESERVICE_API_KEY ||
          process.env.ORS_API_KEY ||
          process.env.VITE_OPENROUTESERVICE_API_KEY
        : undefined) ||
      (typeof import.meta !== "undefined" && import.meta.env
        ? (import.meta.env.VITE_OPENROUTESERVICE_API_KEY as string | undefined) ||
          (import.meta.env.OPENROUTESERVICE_API_KEY as string | undefined)
        : undefined);

    if (!apiKey && typeof process !== "undefined" && typeof process.cwd === "function") {
      try {
        const fs = await import("node:fs");
        const path = await import("node:path");
        const envPath = path.resolve(process.cwd(), ".env");
        if (fs.existsSync(envPath)) {
          const content = fs.readFileSync(envPath, "utf-8");
          const match = content.match(/OPENROUTESERVICE_API_KEY\s*=\s*(.+)/);
          if (match && match[1]) {
            apiKey = match[1].trim();
          }
        }
      } catch {
        // Ignored in non-Node environments
      }
    }

    console.info(
      `[Directions Service] Requesting walking directions: Start=[${data.start[0].toFixed(5)}, ${data.start[1].toFixed(5)}], End=[${data.end[0].toFixed(5)}, ${data.end[1].toFixed(5)}]`,
    );

    let isDistanceLimitError = false;
    let distanceErrorMessage = "";

    if (apiKey) {
      // Automatic retry logic: try up to 2 times with a 2-second delay before falling back
      const maxAttempts = 2;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const geojson = await fetchOrsDirections(apiKey, data.start, data.end);
          if (geojson.features && geojson.features.length > 0) {
            console.info(`[Directions Service] Route Source: OpenRouteService (attempt ${attempt})`);
            return {
              source: "OpenRouteService",
              routes: geojson.features.map(
                (f: {
                  geometry: { coordinates: [number, number][] };
                  properties?: {
                    summary?: { distance?: number; duration?: number };
                    segments?: Array<{
                      steps?: Array<{
                        instruction: string;
                        name?: string;
                        distance: number;
                        duration: number;
                      }>;
                    }>;
                  };
                }) => {
                  const rawSteps = f.properties?.segments?.[0]?.steps || [];
                  const steps: NavStep[] = rawSteps.map((s) => ({
                    instruction: s.instruction || `Continue along ${s.name || "street"}`,
                    detail: s.name ? `Along ${s.name}` : "Follow pedestrian route",
                    inMeters: Math.round(s.distance),
                  }));

                  const defaultGenericSteps: NavStep[] = [
                    { instruction: "Head towards your destination", detail: "Follow pedestrian path", inMeters: Math.round((f.properties?.summary?.distance ?? 1000) * 0.5) },
                    { instruction: "Continue along the route", detail: "Follow walking directions", inMeters: Math.round((f.properties?.summary?.distance ?? 1000) * 0.4) },
                    { instruction: "Arrive at destination", detail: "Destination reached", inMeters: Math.round((f.properties?.summary?.distance ?? 1000) * 0.1) },
                  ];

                  return {
                    coordinates: f.geometry.coordinates,
                    distanceMeters: f.properties?.summary?.distance,
                    durationSeconds: f.properties?.summary?.duration,
                    steps: steps.length > 0 ? steps : defaultGenericSteps,
                  };
                },
              ),
            };
          }
        } catch (err: any) {
          const errMsg = err?.message || String(err);
          console.warn(`[Directions Service] ORS attempt ${attempt}/${maxAttempts} failed:`, errMsg);

          // Check for code 2004 or 400 parameter / distance limit
          if (errMsg.includes("2004") || errMsg.includes("exceed the server configuration limits") || errMsg.includes("6000000")) {
            isDistanceLimitError = true;
            distanceErrorMessage = "Distance too far for walking. Please choose a closer destination in the same metro area.";
            break; // Do not retry when distance is fundamentally impossible
          }

          if (attempt < maxAttempts) {
            console.info("[Directions Service] Retrying ORS in 2000ms...");
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }
      }
    } else {
      console.info("[Directions Service] No ORS API key configured, checking OSM fallback...");
    }

    if (isDistanceLimitError) {
      console.info("[Directions Service] Distance limit exceeded — returning no walking route.");
      return {
        source: "none",
        routes: [],
        error: distanceErrorMessage || "No walking route found — destination is too far to walk.",
      };
    }

    // Try OSM Foot router or robust fallback
    try {
      const osmUrl = `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${data.start[0]},${data.start[1]};${data.end[0]},${data.end[1]}?overview=full&geometries=geojson&alternatives=true`;
      const osmRes = await fetch(osmUrl, { signal: AbortSignal.timeout(3500) });
      if (osmRes.ok) {
        const osmData = await osmRes.json();
        if (osmData.routes && osmData.routes.length > 0) {
          console.info(`[Directions Service] Route Source: OSM fallback (${osmData.routes.length} route(s))`);
          return {
            source: "OSM fallback",
            routes: osmData.routes.map(
              (r: {
                geometry: { coordinates: [number, number][] };
                distance: number;
                duration: number;
              }) => ({
                coordinates: r.geometry.coordinates,
                distanceMeters: r.distance,
                durationSeconds: r.duration,
                steps: [
                  { instruction: "Head towards your destination", detail: "Follow pedestrian path", inMeters: Math.round(r.distance * 0.5) },
                  { instruction: "Continue along the route", detail: "Follow walking directions", inMeters: Math.round(r.distance * 0.4) },
                  { instruction: "Arrive at destination", detail: "Destination reached", inMeters: Math.round(r.distance * 0.1) },
                ],
              }),
            ),
          };
        }
      }
    } catch (err) {
      console.warn(
        "[Directions Service] OSM fallback unreachable, evaluating coordinates:",
        err,
      );
    }

    // Only use Phoenix pre-calculated fallback if coordinates are actually near Phoenix Downtown
    const isNearPhoenix =
      Math.abs(data.start[0] - (-112.074)) < 0.15 &&
      Math.abs(data.start[1] - 33.4484) < 0.15 &&
      Math.abs(data.end[0] - (-112.0796)) < 0.15 &&
      Math.abs(data.end[1] - 33.4772) < 0.15;

    if (isNearPhoenix) {
      console.info("[Directions Service] Route Source: hardcoded fail-safe (Phoenix corridor)");
      return {
        source: "hardcoded fail-safe",
        routes: FALLBACK_PHOENIX_ROUTES.map((coords) => ({
          coordinates: coords,
          steps: DEFAULT_PHOENIX_NAV_STEPS,
        })),
        notice: "Serving pre-calculated Phoenix street trajectories",
      };
    }

    // Otherwise return clean error instead of displaying unrelated Phoenix route
    return {
      source: "none",
      routes: [],
      error: "No walking route found — please select a closer destination.",
    };
  });
