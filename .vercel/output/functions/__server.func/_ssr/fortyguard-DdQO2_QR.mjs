import { r as __toESM } from "../_runtime.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { f as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-BNXmm2uf.mjs";
import { i as objectType, n as arrayType, o as tupleType, r as numberType, t as anyType } from "../_libs/zod.mjs";
import { t as require_leaflet_src } from "../_libs/leaflet.mjs";
import { a as CircleMarker, i as MapContainer, n as Polyline, o as useMap, r as Polygon, t as TileLayer } from "../_libs/react-leaflet.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fortyguard-DdQO2_QR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_leaflet_src = /* @__PURE__ */ __toESM(require_leaflet_src());
var DEFAULT_MAP_CENTER = [39.8283, -98.5795];
var DEFAULT_ZOOM = 4;
function getTileColor(tempC) {
	if (tempC >= 40) return "rgb(239, 68, 68)";
	if (tempC >= 38) return "rgb(249, 115, 22)";
	if (tempC >= 36) return "rgb(234, 179, 8)";
	if (tempC >= 34) return "rgb(59, 130, 246)";
	return "rgb(34, 197, 94)";
}
var ROUTE_COLORS = {
	"heat-safe": {
		main: "rgb(68, 209, 137)",
		glow: "rgba(68, 209, 137, 0.4)"
	},
	fastest: {
		main: "rgb(240, 240, 245)",
		glow: "rgba(240, 240, 245, 0.3)"
	},
	balanced: {
		main: "rgb(96, 165, 250)",
		glow: "rgba(96, 165, 250, 0.35)"
	}
};
/** Helper to fit map bounds to visible routes or tiles */
function MapBoundsController({ routes, tiles, paddingRight = 420 }) {
	const map = useMap();
	(0, import_react.useEffect)(() => {
		const latLngs = [];
		if (routes && routes.length > 0) routes.forEach((r) => {
			r.geometry.forEach(([lon, lat]) => {
				latLngs.push([lat, lon]);
			});
		});
		else if (tiles && tiles.length > 0) tiles.forEach((t) => {
			t.polygon.forEach(([lon, lat]) => {
				latLngs.push([lat, lon]);
			});
		});
		if (latLngs.length > 0) {
			const bounds = import_leaflet_src.default.latLngBounds(latLngs);
			map.fitBounds(bounds, {
				paddingTopLeft: [40, 40],
				paddingBottomRight: [paddingRight, 40],
				maxZoom: 16
			});
		}
	}, [
		routes,
		tiles,
		paddingRight,
		map
	]);
	return null;
}
function InteractiveMap({ routes, activeRouteId, onSelectRoute, drawKey: _drawKey, progress, dim = false, tiles, className, fitBoundsPaddingRight = 420 }) {
	const [isMounted, setIsMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setIsMounted(true);
	}, []);
	const active = (0, import_react.useMemo)(() => routes?.find((r) => r.id === activeRouteId) ?? routes?.[0], [routes, activeRouteId]);
	const progressCoord = (0, import_react.useMemo)(() => {
		if (typeof progress !== "number" || !active || !active.geometry.length) return null;
		const index = Math.min(Math.floor(progress * (active.geometry.length - 1)), active.geometry.length - 1);
		const [lon, lat] = active.geometry[index];
		return [lat, lon];
	}, [active, progress]);
	const originCoord = (0, import_react.useMemo)(() => {
		if (!routes?.[0]?.geometry?.[0]) return null;
		const [lon, lat] = routes[0].geometry[0];
		return [lat, lon];
	}, [routes]);
	const destCoord = (0, import_react.useMemo)(() => {
		if (!routes?.[0]?.geometry?.length) return null;
		const [lon, lat] = routes[0].geometry[routes[0].geometry.length - 1];
		return [lat, lon];
	}, [routes]);
	if (!isMounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 bg-background/50 flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "label-xs text-muted-foreground animate-pulse",
			children: "Loading map..."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: className || "absolute inset-0 overflow-hidden transition-opacity duration-500",
		style: { opacity: dim ? .42 : 1 },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MapContainer, {
			center: DEFAULT_MAP_CENTER,
			zoom: DEFAULT_ZOOM,
			scrollWheelZoom: true,
			zoomControl: false,
			className: "h-full w-full z-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TileLayer, {
					attribution: "© <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\" rel=\"noopener noreferrer\">OpenStreetMap</a> contributors",
					url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapBoundsController, {
					routes,
					tiles,
					paddingRight: fitBoundsPaddingRight
				}),
				tiles?.map((tile) => {
					const positions = tile.polygon.map(([lon, lat]) => [lat, lon]);
					const fillColor = getTileColor(tile.averageTempC);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Polygon, {
						positions,
						pathOptions: {
							color: fillColor,
							weight: .8,
							opacity: .4,
							fillColor,
							fillOpacity: .32
						}
					}, tile.id);
				}),
				routes?.map((route) => {
					const isActive = route.id === active?.id;
					const colors = ROUTE_COLORS[route.kind] ?? ROUTE_COLORS["heat-safe"];
					const positions = route.geometry.map(([lon, lat]) => [lat, lon]);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Polyline, {
						positions,
						pathOptions: {
							color: colors.glow,
							weight: isActive ? 14 : 9,
							opacity: isActive ? .85 : .35,
							lineCap: "round",
							lineJoin: "round"
						},
						eventHandlers: { click: () => onSelectRoute?.(route.id) }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Polyline, {
						positions,
						pathOptions: {
							color: colors.main,
							weight: isActive ? 6 : 4,
							opacity: isActive ? 1 : .65,
							lineCap: "round",
							lineJoin: "round"
						},
						eventHandlers: { click: () => onSelectRoute?.(route.id) }
					})] }, route.id);
				}),
				originCoord ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleMarker, {
					center: originCoord,
					radius: 12,
					pathOptions: {
						color: "rgba(96, 165, 250, 0.4)",
						fillColor: "#3b82f6",
						fillOpacity: .3,
						weight: 2
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleMarker, {
					center: originCoord,
					radius: 6,
					pathOptions: {
						color: "#ffffff",
						fillColor: "#3b82f6",
						fillOpacity: 1,
						weight: 2
					}
				})] }) : null,
				destCoord ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleMarker, {
					center: destCoord,
					radius: 14,
					pathOptions: {
						color: "rgba(239, 68, 68, 0.4)",
						fillColor: "#ef4444",
						fillOpacity: .3,
						weight: 2
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleMarker, {
					center: destCoord,
					radius: 6,
					pathOptions: {
						color: "#ffffff",
						fillColor: "#ef4444",
						fillOpacity: 1,
						weight: 2
					}
				})] }) : null,
				progressCoord ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleMarker, {
					center: progressCoord,
					radius: 14,
					pathOptions: {
						color: "rgba(68, 209, 137, 0.5)",
						fillColor: "rgb(68, 209, 137)",
						fillOpacity: .4,
						weight: 2
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleMarker, {
					center: progressCoord,
					radius: 7,
					pathOptions: {
						color: "#ffffff",
						fillColor: "rgb(68, 209, 137)",
						fillOpacity: 1,
						weight: 3
					}
				})] }) : null
			]
		})
	});
}
function ThermalMap(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InteractiveMap, { ...props });
}
function ThermalLegend({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `glass-panel flex items-center gap-3 rounded-full px-4 py-2 ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label-xs",
				children: "Cooler"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "thermal-bar h-1.5 w-24 rounded-full sm:w-36" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label-xs",
				children: "Hotter"
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
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
/**
* Helper to compute stats from tiles array if not provided by API
*/
/**
* Server function to fetch and cache FortyGuard temperature tiles for a set of routes
*/
var getTemperatureHeatmap = createServerFn({ method: "POST" }).validator(objectType({ routesCoordinates: arrayType(arrayType(tupleType([numberType(), numberType()]))) })).handler(createSsrRpc("18953c3e96f1fbcf3e2ef03dd924a79576ec1301eb37c15083e132c1cdc5565e"));
/**
* Samples ~20 points along a route geometry, locates intersecting FortyGuard tiles,
* and calculates peakTempC, avgTempC, and highHeatMinutes.
*/
function calculateRouteThermalMetrics(routeCoordinates, durationMin, tiles, defaultBaselineTempC = 38.2, samplePointsCount = 20, thresholdC = 38) {
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
/**
* Server function to fetch real FortyGuard 12-hour forecast at 5 time offsets:
* Now (+0h), +3h, +6h, +9h, +12h.
* Returns real peak/avg temperatures per slot or marks slot as unavailable if failed.
*/
var getRouteForecast = createServerFn({ method: "POST" }).validator(objectType({
	routeCoordinates: arrayType(tupleType([numberType(), numberType()])),
	durationMin: numberType().default(20),
	currentTiles: arrayType(anyType()).optional()
})).handler(createSsrRpc("a6f30602e4362437b274a3a6b2c7fe6920610c50e043e40cc2c8b1c3f9b6eac6"));
/**
* Server function to fetch real cooler route thermal metrics and tiles
* (using the pre-fetched +6h / +9h evening forecast data) for the simulated condition change.
*/
var getCoolerRerouteData = createServerFn({ method: "POST" }).validator(objectType({
	routeCoordinates: arrayType(tupleType([numberType(), numberType()])),
	durationMin: numberType().default(21)
})).handler(createSsrRpc("7773f1b38864253439cd185d954a1108c5027a663acc3c7021b9711e8aafa1ed"));
//#endregion
export { getCoolerRerouteData as a, createSsrRpc as i, ThermalMap as n, getRouteForecast as o, calculateRouteThermalMetrics as r, getTemperatureHeatmap as s, ThermalLegend as t };
