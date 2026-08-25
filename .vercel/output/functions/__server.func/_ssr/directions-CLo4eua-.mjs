// SSR Browser Globals Polyfill
if (typeof self === "undefined") globalThis.self = globalThis;
if (typeof window === "undefined") globalThis.window = globalThis;
if (typeof screen === "undefined") globalThis.screen = {
	deviceXDPI: 96,
	logicalXDPI: 96
};
if (typeof devicePixelRatio === "undefined") globalThis.devicePixelRatio = 1;
if (typeof navigator === "undefined") globalThis.navigator = {
	userAgent: "",
	platform: ""
};
if (typeof document === "undefined") {
	const noop = () => ({});
	const fakeEl = () => ({
		style: {},
		setAttribute: noop,
		getAttribute: noop,
		appendChild: noop,
		getContext: () => null
	});
	globalThis.document = {
		documentElement: { style: {} },
		createElement: fakeEl,
		createElementNS: fakeEl,
		getElementsByTagName: () => [],
		querySelector: () => null,
		querySelectorAll: () => [],
		addEventListener: noop,
		removeEventListener: noop,
		createTextNode: noop,
		head: { appendChild: noop },
		body: { appendChild: noop }
	};
}
// End SSR Browser Globals Polyfill
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { i as objectType, o as tupleType, r as numberType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/directions-CLo4eua-.js
var FALLBACK_PHOENIX_ROUTES = [[
	[-112.074, 33.4484],
	[-112.074, 33.451],
	[-112.0741, 33.4552],
	[-112.0741, 33.4601],
	[-112.0742, 33.4655],
	[-112.0743, 33.471],
	[-112.0743, 33.475],
	[-112.0775, 33.4751],
	[-112.0796, 33.4751],
	[-112.0796, 33.4772]
], [
	[-112.074, 33.4484],
	[-112.0765, 33.4484],
	[-112.0772, 33.4525],
	[-112.0772, 33.458],
	[-112.0773, 33.4635],
	[-112.0774, 33.4695],
	[-112.0775, 33.4745],
	[-112.0796, 33.4745],
	[-112.0796, 33.4772]
]];
var DEFAULT_PHOENIX_NAV_STEPS = [
	{
		instruction: "Head north on N Central Ave",
		detail: "Main arterial corridor",
		inMeters: 400
	},
	{
		instruction: "Turn left onto W Roosevelt St",
		detail: "Tree-lined pedestrian street",
		inMeters: 350
	},
	{
		instruction: "Turn right onto N 3rd Ave",
		detail: "Canopy-shaded residential sidewalk",
		inMeters: 600
	},
	{
		instruction: "Continue onto Encanto Blvd path",
		detail: "Park entrance greenway",
		inMeters: 250
	},
	{
		instruction: "Arrive at Encanto Park",
		detail: "Destination, Phoenix, AZ",
		inMeters: 100
	}
];
async function fetchOrsDirections(apiKey, start, end) {
	return new Promise(async (resolve, reject) => {
		const https = await import("node:https");
		const payload = JSON.stringify({
			coordinates: [start, end],
			alternative_routes: {
				target_count: 2,
				share_factor: .8,
				weight_factor: 1.6
			}
		});
		const req = https.request({
			hostname: "api.openrouteservice.org",
			port: 443,
			path: "/v2/directions/foot-walking/geojson",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
				Authorization: apiKey,
				"User-Agent": "HeatRoute-Navigator/1.0",
				"Content-Length": Buffer.byteLength(payload)
			},
			timeout: 1e4
		}, (res) => {
			let raw = "";
			res.on("data", (chunk) => raw += chunk);
			res.on("end", () => {
				if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) try {
					resolve(JSON.parse(raw));
				} catch (err) {
					reject(err);
				}
				else reject(/* @__PURE__ */ new Error(`ORS returned ${res.statusCode}: ${raw}`));
			});
		});
		req.on("error", (err) => reject(err));
		req.on("timeout", () => {
			req.destroy();
			reject(/* @__PURE__ */ new Error("ORS request timed out"));
		});
		req.write(payload);
		req.end();
	});
}
var getWalkingRoutes_createServerFn_handler = createServerRpc({
	id: "da307b03eb2928ac320c94efda38ed2c57241f2a5d01447cbabc69165b19a181",
	name: "getWalkingRoutes",
	filename: "src/lib/directions.ts"
}, (opts) => getWalkingRoutes.__executeServer(opts));
var getWalkingRoutes = createServerFn({ method: "POST" }).validator(objectType({
	start: tupleType([numberType(), numberType()]),
	end: tupleType([numberType(), numberType()])
})).handler(getWalkingRoutes_createServerFn_handler, async ({ data }) => {
	let apiKey = (typeof process !== "undefined" && process.env ? process.env.OPENROUTESERVICE_API_KEY || process.env.ORS_API_KEY || process.env.VITE_OPENROUTESERVICE_API_KEY : void 0) || (typeof import.meta !== "undefined" && {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/"
	} ? void 0 : void 0);
	if (!apiKey && typeof process !== "undefined" && typeof process.cwd === "function") try {
		const fs = await import("node:fs");
		const envPath = (await import("node:path")).resolve(process.cwd(), ".env");
		if (fs.existsSync(envPath)) {
			const match = fs.readFileSync(envPath, "utf-8").match(/OPENROUTESERVICE_API_KEY\s*=\s*(.+)/);
			if (match && match[1]) apiKey = match[1].trim();
		}
	} catch {}
	console.info(`[Directions Service] Requesting walking directions: Start=[${data.start[0].toFixed(5)}, ${data.start[1].toFixed(5)}], End=[${data.end[0].toFixed(5)}, ${data.end[1].toFixed(5)}]`);
	let isDistanceLimitError = false;
	let distanceErrorMessage = "";
	if (apiKey) {
		const maxAttempts = 2;
		for (let attempt = 1; attempt <= maxAttempts; attempt++) try {
			const geojson = await fetchOrsDirections(apiKey, data.start, data.end);
			if (geojson.features && geojson.features.length > 0) {
				console.info(`[Directions Service] Route Source: OpenRouteService (attempt ${attempt})`);
				return {
					source: "OpenRouteService",
					routes: geojson.features.map((f) => {
						const steps = (f.properties?.segments?.[0]?.steps || []).map((s) => ({
							instruction: s.instruction || `Continue along ${s.name || "street"}`,
							detail: s.name ? `Along ${s.name}` : "Follow pedestrian route",
							inMeters: Math.round(s.distance)
						}));
						const defaultGenericSteps = [
							{
								instruction: "Head towards your destination",
								detail: "Follow pedestrian path",
								inMeters: Math.round((f.properties?.summary?.distance ?? 1e3) * .5)
							},
							{
								instruction: "Continue along the route",
								detail: "Follow walking directions",
								inMeters: Math.round((f.properties?.summary?.distance ?? 1e3) * .4)
							},
							{
								instruction: "Arrive at destination",
								detail: "Destination reached",
								inMeters: Math.round((f.properties?.summary?.distance ?? 1e3) * .1)
							}
						];
						return {
							coordinates: f.geometry.coordinates,
							distanceMeters: f.properties?.summary?.distance,
							durationSeconds: f.properties?.summary?.duration,
							steps: steps.length > 0 ? steps : defaultGenericSteps
						};
					})
				};
			}
		} catch (err) {
			const errMsg = err?.message || String(err);
			console.warn(`[Directions Service] ORS attempt ${attempt}/${maxAttempts} failed:`, errMsg);
			if (errMsg.includes("2004") || errMsg.includes("exceed the server configuration limits") || errMsg.includes("6000000")) {
				isDistanceLimitError = true;
				distanceErrorMessage = "Distance too far for walking. Please choose a closer destination in the same metro area.";
				break;
			}
			if (attempt < maxAttempts) {
				console.info("[Directions Service] Retrying ORS in 2000ms...");
				await new Promise((resolve) => setTimeout(resolve, 2e3));
			}
		}
	} else console.info("[Directions Service] No ORS API key configured, checking OSM fallback...");
	if (isDistanceLimitError) {
		console.info("[Directions Service] Distance limit exceeded — returning no walking route.");
		return {
			source: "none",
			routes: [],
			error: distanceErrorMessage || "No walking route found — destination is too far to walk."
		};
	}
	try {
		const osmUrl = `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${data.start[0]},${data.start[1]};${data.end[0]},${data.end[1]}?overview=full&geometries=geojson&alternatives=true`;
		const osmRes = await fetch(osmUrl, { signal: AbortSignal.timeout(3500) });
		if (osmRes.ok) {
			const osmData = await osmRes.json();
			if (osmData.routes && osmData.routes.length > 0) {
				console.info(`[Directions Service] Route Source: OSM fallback (${osmData.routes.length} route(s))`);
				return {
					source: "OSM fallback",
					routes: osmData.routes.map((r) => ({
						coordinates: r.geometry.coordinates,
						distanceMeters: r.distance,
						durationSeconds: r.duration,
						steps: [
							{
								instruction: "Head towards your destination",
								detail: "Follow pedestrian path",
								inMeters: Math.round(r.distance * .5)
							},
							{
								instruction: "Continue along the route",
								detail: "Follow walking directions",
								inMeters: Math.round(r.distance * .4)
							},
							{
								instruction: "Arrive at destination",
								detail: "Destination reached",
								inMeters: Math.round(r.distance * .1)
							}
						]
					}))
				};
			}
		}
	} catch (err) {
		console.warn("[Directions Service] OSM fallback unreachable, evaluating coordinates:", err);
	}
	if (Math.abs(data.start[0] - -112.074) < .15 && Math.abs(data.start[1] - 33.4484) < .15 && Math.abs(data.end[0] - -112.0796) < .15 && Math.abs(data.end[1] - 33.4772) < .15) {
		console.info("[Directions Service] Route Source: hardcoded fail-safe (Phoenix corridor)");
		return {
			source: "hardcoded fail-safe",
			routes: FALLBACK_PHOENIX_ROUTES.map((coords) => ({
				coordinates: coords,
				steps: DEFAULT_PHOENIX_NAV_STEPS
			})),
			notice: "Serving pre-calculated Phoenix street trajectories"
		};
	}
	return {
		source: "none",
		routes: [],
		error: "No walking route found — please select a closer destination."
	};
});
//#endregion
export { getWalkingRoutes_createServerFn_handler };
