import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as tupleType, i as stringType, n as numberType, r as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/geocoding-BvYc6p97.js
async function fetchOrsGeocode(apiKey, text, focusPoint) {
	return new Promise(async (resolve, reject) => {
		const https = await import("node:https");
		let urlPath = `/geocode/autocomplete?api_key=${encodeURIComponent(apiKey)}&text=${encodeURIComponent(text)}&size=6`;
		if (focusPoint && isFinite(focusPoint[0]) && isFinite(focusPoint[1])) urlPath += `&focus.point.lat=${focusPoint[1]}&focus.point.lon=${focusPoint[0]}`;
		const req = https.request({
			hostname: "api.openrouteservice.org",
			port: 443,
			path: urlPath,
			method: "GET",
			headers: {
				Accept: "application/json",
				"User-Agent": "HeatRoute-Navigator/1.0"
			},
			timeout: 6e3
		}, (res) => {
			let raw = "";
			res.on("data", (chunk) => raw += chunk);
			res.on("end", () => {
				if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) try {
					resolve(JSON.parse(raw));
				} catch (err) {
					reject(err);
				}
				else reject(/* @__PURE__ */ new Error(`ORS Geocode returned ${res.statusCode}: ${raw}`));
			});
		});
		req.on("error", (err) => reject(err));
		req.on("timeout", () => {
			req.destroy();
			reject(/* @__PURE__ */ new Error("ORS Geocode request timed out"));
		});
		req.end();
	});
}
var searchPlaces_createServerFn_handler = createServerRpc({
	id: "6b060ee3fe4e23e765c805794e6551e62d216cac8ee67283335311f6602c2b00",
	name: "searchPlaces",
	filename: "src/lib/geocoding.ts"
}, (opts) => searchPlaces.__executeServer(opts));
var searchPlaces = createServerFn({ method: "POST" }).validator(objectType({
	text: stringType().min(1),
	focusPoint: tupleType([numberType(), numberType()]).optional()
})).handler(searchPlaces_createServerFn_handler, async ({ data }) => {
	let apiKey = process.env.OPENROUTESERVICE_API_KEY || process.env.ORS_API_KEY || process.env.VITE_OPENROUTESERVICE_API_KEY;
	if (!apiKey) try {
		const fs = await import("node:fs");
		const envPath = (await import("node:path")).resolve(process.cwd(), ".env");
		if (fs.existsSync(envPath)) {
			const match = fs.readFileSync(envPath, "utf-8").match(/OPENROUTESERVICE_API_KEY\s*=\s*(.+)/);
			if (match && match[1]) apiKey = match[1].trim();
		}
	} catch {}
	if (apiKey) {
		const maxAttempts = 2;
		for (let attempt = 1; attempt <= maxAttempts; attempt++) try {
			const geojson = await fetchOrsGeocode(apiKey, data.text, data.focusPoint);
			if (geojson.features && geojson.features.length > 0) return {
				source: "OpenRouteService",
				suggestions: geojson.features.map((f, idx) => ({
					id: f.properties?.id || `ors-${idx}-${f.geometry.coordinates.join(",")}`,
					name: f.properties?.name || f.properties?.label?.split(",")[0] || "Unknown Place",
					label: f.properties?.label || f.properties?.name || "Unknown Location",
					coordinates: f.geometry.coordinates,
					locality: f.properties?.locality || f.properties?.county,
					region: f.properties?.region_a || f.properties?.region
				}))
			};
		} catch (err) {
			console.warn(`[Geocoding Service] ORS Geocode attempt ${attempt}/${maxAttempts} failed:`, err?.message || err);
			if (attempt < maxAttempts) await new Promise((resolve) => setTimeout(resolve, 1500));
		}
	}
	return {
		source: "fallback",
		suggestions: []
	};
});
//#endregion
export { searchPlaces_createServerFn_handler };
