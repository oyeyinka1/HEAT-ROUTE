import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as stringType, i as objectType, o as tupleType, r as numberType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/geocoding-C1HBqxwO.js
var PHOENIX_FALLBACK_SUGGESTIONS = [
	{
		id: "encanto-park",
		name: "Encanto Park",
		label: "Encanto Park, Phoenix, AZ, USA",
		coordinates: [-112.0796, 33.4772],
		locality: "Phoenix",
		region: "AZ"
	},
	{
		id: "phoenix-art-museum",
		name: "Phoenix Art Museum",
		label: "Phoenix Art Museum, Central Ave, Phoenix, AZ, USA",
		coordinates: [-112.0738, 33.4674],
		locality: "Phoenix",
		region: "AZ"
	},
	{
		id: "heritage-square",
		name: "Heritage Square",
		label: "Heritage Square, 7th St, Phoenix, AZ, USA",
		coordinates: [-112.0664, 33.4497],
		locality: "Phoenix",
		region: "AZ"
	},
	{
		id: "roosevelt-row",
		name: "Roosevelt Row",
		label: "Roosevelt Row Arts District, Phoenix, AZ, USA",
		coordinates: [-112.0729, 33.4589],
		locality: "Phoenix",
		region: "AZ"
	}
];
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
async function fetchPhotonGeocode(text, focusPoint) {
	try {
		let url = `https://photon.komoot.io/api/?q=${encodeURIComponent(text)}&limit=6`;
		if (focusPoint && isFinite(focusPoint[0]) && isFinite(focusPoint[1])) url += `&lat=${focusPoint[1]}&lon=${focusPoint[0]}`;
		const res = await fetch(url, {
			headers: { "User-Agent": "HeatRoute-Navigator/1.0" },
			signal: AbortSignal.timeout(4e3)
		});
		if (res.ok) {
			const data = await res.json();
			if (data.features && data.features.length > 0) return data.features.map((f, idx) => {
				const props = f.properties || {};
				const name = props.name || props.street || props.city || "Location";
				const parts = [
					props.name,
					props.street,
					props.city || props.district,
					props.state,
					props.country
				].filter(Boolean);
				const label = Array.from(new Set(parts)).join(", ");
				return {
					id: `osm-${props.osm_id || idx}-${f.geometry.coordinates.join(",")}`,
					name,
					label: label || name,
					coordinates: f.geometry.coordinates,
					locality: props.city || props.district || props.county,
					region: props.state
				};
			});
		}
	} catch (err) {
		console.warn("[Geocoding Service] Photon fallback error:", err);
	}
	return [];
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
	if (apiKey) try {
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
		console.warn("[Geocoding Service] ORS Geocode failed, trying Photon OSM fallback:", err?.message || err);
	}
	const osmSuggestions = await fetchPhotonGeocode(data.text, data.focusPoint);
	if (osmSuggestions.length > 0) return {
		source: "OpenRouteService",
		suggestions: osmSuggestions
	};
	const lower = data.text.toLowerCase();
	const curatedMatches = PHOENIX_FALLBACK_SUGGESTIONS.filter((s) => s.name.toLowerCase().includes(lower) || s.label.toLowerCase().includes(lower) || lower.includes("phoenix") || lower.includes("encanto") || lower.includes("park") || lower.includes("museum") || lower.includes("square") || lower.includes("roosevelt"));
	return {
		source: "fallback",
		suggestions: curatedMatches.length > 0 ? curatedMatches : PHOENIX_FALLBACK_SUGGESTIONS
	};
});
//#endregion
export { searchPlaces_createServerFn_handler };
