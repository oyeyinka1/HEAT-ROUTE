import { i as __toESM, n as __exportAll$1 } from "../_runtime.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-DG6ZwK-c.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { S as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as objectType, n as arrayType, o as tupleType, r as numberType, t as anyType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fortyguard-03YRGTLV.js
var fortyguard_03YRGTLV_exports = /* @__PURE__ */ __exportAll$1({
	a: () => ThermalLegend,
	i: () => createSsrRpc,
	n: () => getRouteForecast,
	o: () => ThermalMap_exports,
	r: () => getTemperatureHeatmap,
	t: () => getCoolerRerouteData
});
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
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
/** Inner map component — only rendered after leaflet is loaded on the client */
function ClientMap({ routes, activeRouteId, onSelectRoute, progress, dim = false, tiles, className, fitBoundsPaddingRight = 420, L, RL }) {
	const { MapContainer, TileLayer, Polyline, CircleMarker, Polygon, useMap } = RL;
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
	/** Inner bounds controller — uses useMap hook, must be inside MapContainer */
	function MapBoundsController() {
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
				const bounds = L.latLngBounds(latLngs);
				map.fitBounds(bounds, {
					paddingTopLeft: [40, 40],
					paddingBottomRight: [fitBoundsPaddingRight, 40],
					maxZoom: 16
				});
			}
		}, [map]);
		return null;
	}
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapBoundsController, {}),
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
function InteractiveMap(props) {
	const [libs, setLibs] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		Promise.all([import("../_libs/@react-leaflet/core+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.b())), import("../_libs/react-leaflet.mjs").then((n) => n.t)]).then(([L, RL]) => {
			setLibs({
				L,
				RL
			});
		});
	}, []);
	if (!libs) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 bg-background/50 flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "label-xs text-muted-foreground animate-pulse",
			children: "Loading map..."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientMap, {
		...props,
		L: libs.L,
		RL: libs.RL
	});
}
var ThermalMap_exports = /* @__PURE__ */ __exportAll({
	ThermalLegend: () => ThermalLegend,
	ThermalMap: () => ThermalMap
});
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
* Server function to fetch and cache FortyGuard temperature tiles for a set of routes
*/
var getTemperatureHeatmap = createServerFn({ method: "POST" }).validator(objectType({ routesCoordinates: arrayType(arrayType(tupleType([numberType(), numberType()]))) })).handler(createSsrRpc("18953c3e96f1fbcf3e2ef03dd924a79576ec1301eb37c15083e132c1cdc5565e"));
/**
* Server function to fetch real FortyGuard 12-hour forecast at 5 time offsets:
* Now (+0h), +3h, +6h, +9h, +12h.
*/
var getRouteForecast = createServerFn({ method: "POST" }).validator(objectType({
	routeCoordinates: arrayType(tupleType([numberType(), numberType()])),
	durationMin: numberType().default(20),
	currentTiles: arrayType(anyType()).optional()
})).handler(createSsrRpc("a6f30602e4362437b274a3a6b2c7fe6920610c50e043e40cc2c8b1c3f9b6eac6"));
/**
* Server function to fetch real cooler route thermal metrics and tiles
* (using the real forecast data for the active route's actual coordinates) for the simulated condition change.
*/
var getCoolerRerouteData = createServerFn({ method: "POST" }).validator(objectType({
	routeCoordinates: arrayType(tupleType([numberType(), numberType()])),
	durationMin: numberType().default(21),
	currentPeakTempC: numberType().optional(),
	currentHighHeatMinutes: numberType().optional()
})).handler(createSsrRpc("7773f1b38864253439cd185d954a1108c5027a663acc3c7021b9711e8aafa1ed"));
//#endregion
export { getRouteForecast as a, getCoolerRerouteData as i, createSsrRpc as n, getTemperatureHeatmap as o, fortyguard_03YRGTLV_exports as r, ThermalLegend as t };
