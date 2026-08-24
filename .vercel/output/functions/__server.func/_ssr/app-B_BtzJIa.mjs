import { r as __toESM } from "../_runtime.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { f as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Route } from "./app-B72BJIU4.mjs";
import { a as routeAnalysis, i as routeAccent, n as fastestGeometryCoords, r as navSteps, t as analysisStages } from "./heatroute-data-ClpyG0yJ.mjs";
import { a as stringType, i as objectType, o as tupleType, r as numberType } from "../_libs/zod.mjs";
import { a as getCoolerRerouteData, i as createSsrRpc, n as ThermalMap, o as getRouteForecast, r as calculateRouteThermalMetrics, s as getTemperatureHeatmap, t as ThermalLegend } from "./fortyguard-B6mzZsho.mjs";
import { C as Check, S as ChevronRight, T as ArrowLeft, _ as Footprints, a as Thermometer, b as Clock, d as Navigation, g as Layers, h as LoaderCircle, l as Search, m as LocateFixed, p as MapPin, r as TriangleAlert, s as Sparkles, t as X, v as Flame, w as ArrowRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-B_BtzJIa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RouteCard({ route, selected, onSelect, isNearTie = false }) {
	const accent = routeAccent[route.kind];
	const { metrics } = route;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => onSelect(route.id),
		"aria-pressed": selected,
		className: "w-full rounded-xl border p-3 text-left transition-all duration-300 hover:border-border sm:p-4",
		style: {
			borderColor: selected ? accent : "var(--panel-border)",
			background: selected ? `color-mix(in oklab, ${accent} 10%, var(--card))` : "color-mix(in oklab, var(--card) 70%, transparent)",
			boxShadow: selected ? "var(--shadow-panel)" : void 0
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "h-2.5 w-2.5 shrink-0 rounded-full",
						style: { background: accent }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-xs font-semibold uppercase tracking-[0.14em]",
						style: { color: selected ? accent : "var(--foreground)" },
						children: route.label
					})]
				}), route.recommended ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
					style: {
						background: isNearTie ? "color-mix(in oklab, var(--amber-warning, #f59e0b) 22%, transparent)" : "color-mix(in oklab, var(--safe) 18%, transparent)",
						color: isNearTie ? "var(--amber-warning, #f59e0b)" : "var(--safe)",
						border: isNearTie ? "1px solid color-mix(in oklab, var(--amber-warning, #f59e0b) 45%, transparent)" : void 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }),
						" ",
						isNearTie ? "Recommended (Near-Tie)" : "Recommended"
					]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid grid-cols-4 gap-x-2 gap-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric$1, {
						value: `${metrics.durationMin} min`,
						label: "Walk time"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric$1, {
						value: `${metrics.distanceKm} km`,
						label: "Distance"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric$1, {
						value: `${metrics.peakTempC.toFixed(1)}°C`,
						label: "Peak temp",
						color: metrics.peakTempC >= 38 ? "var(--scorch)" : metrics.peakTempC >= 36 ? "var(--hot)" : "var(--safe)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric$1, {
						value: `${metrics.highHeatMinutes} min`,
						label: "High heat",
						color: selected ? accent : void 0
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "label-xs shrink-0 normal-case tracking-normal",
					children: [
						"Avg ",
						metrics.avgTempC.toFixed(1),
						"°C"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "h-1 flex-1 overflow-hidden rounded-full bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block h-full rounded-full transition-all duration-700",
						style: {
							width: `${Math.min(100, metrics.highHeatMinutes / metrics.durationMin * 100)}%`,
							background: accent
						}
					})
				})]
			})
		]
	});
}
function Metric$1({ value, label, color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-sm font-semibold",
			style: { color: color ?? "var(--foreground)" },
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "label-xs mt-0.5 truncate text-[10px] tracking-[0.1em]",
			children: label
		})]
	});
}
var getWalkingRoutes = createServerFn({ method: "POST" }).validator(objectType({
	start: tupleType([numberType(), numberType()]),
	end: tupleType([numberType(), numberType()])
})).handler(createSsrRpc("da307b03eb2928ac320c94efda38ed2c57241f2a5d01447cbabc69165b19a181"));
var searchPlaces = createServerFn({ method: "POST" }).validator(objectType({
	text: stringType().min(1),
	focusPoint: tupleType([numberType(), numberType()]).optional()
})).handler(createSsrRpc("6b060ee3fe4e23e765c805794e6551e62d216cac8ee67283335311f6602c2b00"));
/** The margin (in high-heat minutes) below which or equal to which we consider routes near-identical. */
var NEAR_TIE_THRESHOLD_MIN = 1;
/**
* Selects which route should be recommended based on real RouteMetrics.
*
* @param routes - Array of RouteOption values with already-calculated metrics.
* @returns SelectionResult describing which route wins and why.
*/
function selectRecommendedRoute(routes) {
	if (routes.length === 0) throw new Error("[route-selection] Cannot select from an empty route array.");
	if (routes.length === 1) {
		const only = routes[0];
		return {
			recommendedId: only.id,
			selectedLabel: only.label,
			reason: "Only one route available; it has been selected by default.",
			tradeoff: {
				extraTravelMin: 0,
				heatMinutesSaved: 0,
				reductionPct: 0
			},
			isNearTie: false,
			usedTimeBudgetFallback: false
		};
	}
	const fastestRoute = [...routes].sort((a, b) => a.metrics.durationMin - b.metrics.durationMin)[0];
	const lowestHeatRoute = [...routes].sort((a, b) => a.metrics.highHeatMinutes - b.metrics.highHeatMinutes)[0];
	const maxAllowedDuration = fastestRoute.metrics.durationMin * 1.2;
	const coolerIsWithinTimeBudget = lowestHeatRoute.metrics.durationMin <= maxAllowedDuration;
	const winner = coolerIsWithinTimeBudget ? lowestHeatRoute : fastestRoute;
	const usedTimeBudgetFallback = !coolerIsWithinTimeBudget;
	const byHeat = [...routes].sort((a, b) => a.metrics.highHeatMinutes - b.metrics.highHeatMinutes);
	const bestHeat = byHeat[0].metrics.highHeatMinutes;
	const secondBestHeat = byHeat[1]?.metrics.highHeatMinutes ?? bestHeat;
	const heatDelta = Math.abs(secondBestHeat - bestHeat);
	const isNearTie = heatDelta <= NEAR_TIE_THRESHOLD_MIN;
	console.info(`[RouteSelection] Evaluating ${routes.length} routes: ` + routes.map((r) => `${r.label}(duration:${r.metrics.durationMin}m, highHeat:${r.metrics.highHeatMinutes}m)`).join(", ") + ` | heatDelta: ${heatDelta}m, isNearTie: ${isNearTie}, winner: ${winner.label}`);
	const extraTravelMin = winner.metrics.durationMin - fastestRoute.metrics.durationMin;
	const heatMinutesSaved = fastestRoute.metrics.highHeatMinutes - winner.metrics.highHeatMinutes;
	const reductionPct = fastestRoute.metrics.highHeatMinutes > 0 && heatMinutesSaved > 0 ? Math.round(heatMinutesSaved / fastestRoute.metrics.highHeatMinutes * 100) : 0;
	let reason;
	if (usedTimeBudgetFallback) {
		const timePenalty = Math.round(lowestHeatRoute.metrics.durationMin - fastestRoute.metrics.durationMin);
		reason = `The coolest available route would add ${timePenalty} minute${timePenalty !== 1 ? "s" : ""} of travel time — more than the 20% time budget. No meaningfully safer option exists within a reasonable time cost, so the fastest route is recommended instead.`;
	} else if (winner.id === fastestRoute.id && extraTravelMin === 0) reason = isNearTie ? "Routes showed minimal heat exposure difference; the fastest route is recommended as it also has the lowest high-heat exposure, though the difference between routes is marginal." : "The fastest route also has the lowest high-heat exposure — it is the clear best choice.";
	else if (isNearTie) reason = "Routes showed minimal heat exposure difference (less than 1 minute apart in high-heat exposure). Recommended for having the lowest recorded exposure, though the difference is marginal and routes are effectively equivalent in heat terms.";
	else {
		const timeCostText = extraTravelMin > 0 ? `${extraTravelMin} extra minute${extraTravelMin !== 1 ? "s" : ""} of walking` : "no additional travel time";
		reason = `This route meaningfully reduces time spent in high-heat conditions — saving ${heatMinutesSaved} minute${heatMinutesSaved !== 1 ? "s" : ""} of high-heat exposure (${reductionPct}% less than the fastest route) for ${timeCostText}. It stays well within the acceptable 20% time-cost limit.`;
	}
	return {
		recommendedId: winner.id,
		selectedLabel: winner.label,
		reason,
		tradeoff: {
			extraTravelMin,
			heatMinutesSaved,
			reductionPct
		},
		isNearTie,
		usedTimeBudgetFallback
	};
}
/**
* Applies selection logic to a route array immutably:
* returns a new array where exactly one route has `recommended: true`.
*
* This is the primary integration point — call it whenever route metrics
* are (re)calculated to keep the RECOMMENDED tag in sync.
*/
function applyRecommendation(routes) {
	if (routes.length === 0) return routes;
	const result = selectRecommendedRoute(routes);
	return routes.map((r) => ({
		...r,
		recommended: r.id === result.recommendedId
	}));
}
function HeatRouteApp() {
	const loaderData = Route.useLoaderData();
	const [phase, setPhase] = (0, import_react.useState)("search");
	const [destination, setDestination] = (0, import_react.useState)("");
	const [destinationCoord, setDestinationCoord] = (0, import_react.useState)(null);
	const [originQuery, setOriginQuery] = (0, import_react.useState)("");
	const [originCoord, setOriginCoord] = (0, import_react.useState)(null);
	const [originLabel, setOriginLabel] = (0, import_react.useState)("Detecting location…");
	const [gpsCoord, setGpsCoord] = (0, import_react.useState)(null);
	const [hasUserGeo, setHasUserGeo] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const [stage, setStage] = (0, import_react.useState)(0);
	const [thermalSource, setThermalSource] = (0, import_react.useState)(loaderData?.heatmap?.source ?? null);
	const [thermalTiles, setThermalTiles] = (0, import_react.useState)(loaderData?.heatmap?.tiles || []);
	const [routeError, setRouteError] = (0, import_react.useState)(null);
	const [routes, setRoutes] = (0, import_react.useState)(() => {
		const directionsRoutes = loaderData?.directions?.routes;
		const tiles = loaderData?.heatmap?.tiles || [];
		if (directionsRoutes && directionsRoutes.length > 0) return applyRecommendation(routeAnalysis.routes.map((r, i) => {
			const fetched = directionsRoutes[i] ?? directionsRoutes[0];
			const durationMin = fetched.durationSeconds ? Math.round(fetched.durationSeconds / 60) : r.metrics.durationMin;
			const distanceKm = fetched.distanceMeters ? Number((fetched.distanceMeters / 1e3).toFixed(1)) : r.metrics.distanceKm;
			const thermal = calculateRouteThermalMetrics(fetched.coordinates, durationMin, tiles);
			return {
				...r,
				geometry: fetched.coordinates,
				steps: fetched.steps,
				metrics: {
					...r.metrics,
					durationMin,
					distanceKm,
					peakTempC: thermal.peakTempC,
					avgTempC: thermal.avgTempC,
					highHeatMinutes: thermal.highHeatMinutes
				}
			};
		}));
		return [];
	});
	const [selectedId, setSelectedId] = (0, import_react.useState)("r-heat-safe");
	const [whyOpen, setWhyOpen] = (0, import_react.useState)(false);
	const [stepIndex, setStepIndex] = (0, import_react.useState)(0);
	const [rerouteState, setRerouteState] = (0, import_react.useState)("idle");
	const [coolerRouteOption, setCoolerRouteOption] = (0, import_react.useState)(() => {
		const base = routeAnalysis.routes[0];
		return base ? {
			...base,
			id: "r-cooler",
			label: "Cooler Alternative"
		} : {
			...routeAnalysis.routes[0],
			id: "r-cooler",
			label: "Cooler Alternative"
		};
	});
	const [coolerSlotLabel, setCoolerSlotLabel] = (0, import_react.useState)("+6h (8:00 PM)");
	const [rerouteNotice, setRerouteNotice] = (0, import_react.useState)(null);
	const [isTriggeringReroute, setIsTriggeringReroute] = (0, import_react.useState)(false);
	const [routingSource, setRoutingSource] = (0, import_react.useState)(loaderData?.directions?.source ?? null);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined" && "geolocation" in navigator) navigator.geolocation.getCurrentPosition((position) => {
			const userLon = position.coords.longitude;
			const userLat = position.coords.latitude;
			setOriginCoord([userLon, userLat]);
			setGpsCoord([userLon, userLat]);
			setOriginLabel("Current GPS location");
			setOriginQuery("Current GPS location");
			setHasUserGeo(true);
			console.info("[Geolocation] User location resolved:", [userLon, userLat]);
		}, (error) => {
			console.info("[Geolocation] Permission denied or unavailable:", error.message);
			setOriginCoord(null);
			setGpsCoord(null);
			setOriginLabel("Enter start location");
			setOriginQuery("");
			setHasUserGeo(false);
		}, {
			timeout: 8e3,
			maximumAge: 6e4
		});
		else {
			setOriginLabel("Enter start location");
			setOriginQuery("");
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (loaderData?.directions?.source) setRoutingSource(loaderData.directions.source);
		if (loaderData?.heatmap?.source) setThermalSource(loaderData.heatmap.source);
	}, [loaderData]);
	const selected = (0, import_react.useMemo)(() => routes.find((r) => r.id === selectedId) ?? routes[0], [routes, selectedId]);
	const selectionResult = (0, import_react.useMemo)(() => {
		try {
			return routes.length > 0 ? selectRecommendedRoute(routes) : null;
		} catch {
			return null;
		}
	}, [routes]);
	(0, import_react.useEffect)(() => {
		if (phase !== "analyzing") return;
		if (!originCoord || !destinationCoord) {
			console.warn("[Analysis] Cannot compute route: origin or destination coordinate is null");
			setRouteError("Please set both a start location and a destination before analysing.");
			setPhase("routes");
			return;
		}
		setStage(0);
		let cancelled = false;
		let currentStage = 0;
		const stageInterval = setInterval(() => {
			if (currentStage < analysisStages.length - 1) {
				currentStage += 1;
				setStage(currentStage);
			}
		}, 600);
		async function computeRoutesWithHeatmap() {
			try {
				setRouteError(null);
				const [dirRes, heatRes] = await Promise.all([getWalkingRoutes({ data: {
					start: originCoord,
					end: destinationCoord
				} }), getTemperatureHeatmap({ data: { routesCoordinates: [[originCoord, destinationCoord]] } }).catch((err) => {
					console.warn("[Analysis] Heatmap retrieval fallback:", err);
					return null;
				})]);
				if (cancelled) return;
				if (dirRes.source) setRoutingSource(dirRes.source);
				if (heatRes?.source) setThermalSource(heatRes.source);
				if (dirRes.error || !dirRes.routes || dirRes.routes.length === 0) {
					console.info("[Analysis] No walking routes returned:", dirRes.error);
					setRoutes([]);
					setThermalTiles([]);
					setRouteError(dirRes.error || "No walking route found — destination is too far to walk.");
					return;
				}
				let currentTiles = thermalTiles;
				if (heatRes?.tiles && heatRes.tiles.length > 0) {
					currentTiles = heatRes.tiles;
					setThermalTiles(heatRes.tiles);
				}
				if (dirRes.routes && dirRes.routes.length > 0) {
					const recommendedRoutes = applyRecommendation(dirRes.routes.map((fetched, i) => {
						const isAlt = i > 0;
						const durationMin = fetched.durationSeconds ? Math.round(fetched.durationSeconds / 60) : 20;
						const distanceKm = fetched.distanceMeters ? Number((fetched.distanceMeters / 1e3).toFixed(1)) : 1.5;
						const thermal = calculateRouteThermalMetrics(fetched.coordinates, durationMin, currentTiles);
						return {
							id: isAlt ? "r-direct" : "r-heat-safe",
							kind: isAlt ? "direct" : "heat-safe",
							label: isAlt ? "Direct Route" : "Heat-Safe",
							geometry: fetched.coordinates,
							steps: fetched.steps ?? [],
							recommended: !isAlt,
							metrics: {
								durationMin,
								distanceKm,
								peakTempC: thermal.peakTempC,
								avgTempC: thermal.avgTempC,
								highHeatMinutes: thermal.highHeatMinutes
							}
						};
					}));
					setRoutes(recommendedRoutes);
					if (dirRes.routes[0]?.coordinates) try {
						const routeKey = [
							originCoord[0].toFixed(4),
							originCoord[1].toFixed(4),
							destinationCoord[0].toFixed(4),
							destinationCoord[1].toFixed(4)
						].join(",");
						const routePayload = {
							routeKey,
							destination: destination || query || "Searched Walk",
							origin: originLabel || originQuery || "Start Location",
							coordinates: dirRes.routes[0].coordinates,
							durationMin: Math.round((dirRes.routes[0].durationSeconds ?? 1200) / 60),
							distanceKm: Number(((dirRes.routes[0].distanceMeters ?? 1500) / 1e3).toFixed(1)),
							tiles: currentTiles,
							metrics: recommendedRoutes[0]?.metrics
						};
						sessionStorage.setItem("heatroute_last_analyzed", JSON.stringify(routePayload));
						sessionStorage.removeItem("heatroute_prewarmed_forecast");
						getRouteForecast({ data: {
							routeCoordinates: dirRes.routes[0].coordinates,
							durationMin: routePayload.durationMin,
							currentTiles: routePayload.tiles
						} }).then((res) => {
							try {
								sessionStorage.setItem("heatroute_prewarmed_forecast", JSON.stringify({
									...res,
									routeKey
								}));
							} catch {}
						}).catch((e) => console.warn("[Forecast Pre-warm] Background fetch notice:", e));
					} catch {}
				}
			} catch (err) {
				console.error("Failed to compute routes & temperatures:", err);
				setRoutes([]);
				setThermalTiles([]);
				setRouteError("No walking route found — try a closer destination.");
			} finally {
				if (!cancelled) {
					setStage(analysisStages.length);
					setTimeout(() => {
						if (!cancelled) setPhase("routes");
					}, 350);
				}
			}
		}
		computeRoutesWithHeatmap();
		return () => {
			cancelled = true;
			clearInterval(stageInterval);
		};
	}, [
		phase,
		originCoord,
		destinationCoord
	]);
	function handleSelectOrigin(placeName, coords) {
		setOriginLabel(placeName);
		setOriginQuery(placeName);
		setOriginCoord(coords);
		setHasUserGeo(false);
	}
	function handleUseGpsOrigin() {
		if (gpsCoord) {
			setOriginCoord(gpsCoord);
			setOriginLabel("Current GPS location");
			setOriginQuery("Current GPS location");
			setHasUserGeo(true);
		}
	}
	function handleSelectDestination(placeName, coords) {
		setDestination(placeName);
		setQuery(placeName);
		setDestinationCoord(coords);
	}
	async function handleAnalyze() {
		let currentStart = originCoord;
		let currentEnd = destinationCoord;
		if (!currentStart && originQuery.trim()) try {
			const geo = await searchPlaces({ data: { text: originQuery.trim() } });
			if (geo.suggestions && geo.suggestions.length > 0) {
				currentStart = geo.suggestions[0].coordinates;
				setOriginCoord(currentStart);
				setOriginLabel(geo.suggestions[0].name || originQuery.trim());
			}
		} catch (err) {
			console.warn("[Search] Start geocode fallback:", err);
		}
		if (!currentEnd && query.trim()) try {
			const geo = await searchPlaces({ data: {
				text: query.trim(),
				focusPoint: currentStart ?? void 0
			} });
			if (geo.suggestions && geo.suggestions.length > 0) {
				currentEnd = geo.suggestions[0].coordinates;
				setDestinationCoord(currentEnd);
				setDestination(geo.suggestions[0].name || query.trim());
			}
		} catch (err) {
			console.warn("[Search] Destination geocode fallback:", err);
		}
		if (!currentStart || !currentEnd) {
			setRouteError("Please provide both a start location and a destination.");
			setPhase("routes");
			return;
		}
		setSelectedId("r-heat-safe");
		setPhase("analyzing");
	}
	/**
	* Stage 7: Controlled Demo Trigger for simulated condition change.
	* Loads real FortyGuard evening forecast slot dataset and offers reroute with real metrics.
	*/
	async function triggerSimulatedConditionChange() {
		setIsTriggeringReroute(true);
		setRerouteNotice(null);
		try {
			const activeRoute = selected ?? routes[0];
			const activeCoords = activeRoute?.geometry || fastestGeometryCoords;
			console.info("[Demo Reroute] BEFORE — Current route metrics:", `id=${activeRoute?.id},`, `peak=${activeRoute?.metrics.peakTempC?.toFixed(1)}°C,`, `avg=${activeRoute?.metrics.avgTempC?.toFixed(1)}°C,`, `highHeatMin=${activeRoute?.metrics.highHeatMinutes}min,`, `durationMin=${activeRoute?.metrics.durationMin}min`);
			const rerouteData = await getCoolerRerouteData({ data: {
				routeCoordinates: activeCoords,
				durationMin: Math.max(15, (activeRoute?.metrics.durationMin ?? 20) + 1)
			} });
			if (!rerouteData.available || rerouteData.cacheSource === "unavailable") {
				setRerouteNotice(rerouteData.statusNotice || "Condition simulation unavailable for this location right now");
				return;
			}
			console.info("[Demo Reroute] AFTER — Cooler route metrics:", `slot=${rerouteData.slotKey} (${rerouteData.timeSlotLabel}),`, `source=${rerouteData.cacheSource},`, `tileCount=${rerouteData.tileCount},`, `peak=${rerouteData.route.metrics.peakTempC.toFixed(1)}°C,`, `avg=${rerouteData.route.metrics.avgTempC.toFixed(1)}°C,`, `highHeatMin=${rerouteData.route.metrics.highHeatMinutes}min,`, `durationMin=${rerouteData.route.metrics.durationMin}min`);
			const coolerOption = {
				...activeRoute,
				id: "r-cooler",
				metrics: {
					...activeRoute.metrics,
					peakTempC: rerouteData.route.metrics.peakTempC,
					avgTempC: rerouteData.route.metrics.avgTempC,
					highHeatMinutes: rerouteData.route.metrics.highHeatMinutes
				}
			};
			setCoolerRouteOption(coolerOption);
			setCoolerSlotLabel(rerouteData.timeSlotLabel);
			if (rerouteData.tiles && rerouteData.tiles.length > 0) setThermalTiles(rerouteData.tiles);
			setRerouteState("offered");
		} catch (err) {
			console.warn("[Demo Reroute] Reroute fetch failed:", err);
			setRerouteNotice("Condition simulation unavailable for this location right now");
		} finally {
			setIsTriggeringReroute(false);
		}
	}
	function acceptReroute() {
		setRoutes([routes[0], coolerRouteOption]);
		setSelectedId(coolerRouteOption.id);
		setRerouteState("accepted");
	}
	const mapRoutes = phase === "navigating" || phase === "arrived" ? selected ? [selected] : [] : routes;
	const progress = phase === "navigating" ? Math.min(.95, stepIndex / Math.max(1, (selected?.steps?.length ?? navSteps.length) - 1)) : phase === "arrived" ? 1 : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-[100dvh] w-full overflow-hidden bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThermalMap, {
				routes: mapRoutes,
				activeRouteId: selected?.id,
				onSelectRoute: phase === "routes" ? setSelectedId : void 0,
				drawKey: `${phase}-${routes.map((r) => r.id).join("-")}`,
				...progress !== void 0 ? { progress } : {},
				dim: phase === "analyzing"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {
				temp: selected?.metrics?.peakTempC ?? null,
				routingSource,
				thermalSource
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThermalLegend, { className: "absolute bottom-[calc(var(--sheet-h,58dvh)+0.75rem)] left-4 z-20 hidden md:bottom-6 md:flex" }),
			phase !== "navigating" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute left-6 top-24 z-20 hidden w-[350px] md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-auto animate-rise-in",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchPanel, {
						originQuery,
						setOriginQuery,
						onSelectOrigin: handleSelectOrigin,
						onUseGpsOrigin: gpsCoord ? handleUseGpsOrigin : void 0,
						destinationQuery: query,
						setDestinationQuery: setQuery,
						onSelectDestination: handleSelectDestination,
						onAnalyze: handleAnalyze,
						originLabel,
						destination,
						hasUserGeo,
						gpsAvailable: Boolean(gpsCoord),
						originCoord: originCoord ?? void 0,
						phase
					})
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "absolute inset-x-0 bottom-0 z-30 md:inset-y-0 md:left-auto md:right-0 md:w-[420px] md:p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-panel animate-sheet-up max-h-[80dvh] overflow-y-auto rounded-t-3xl px-4 pb-6 pt-3 md:h-full md:max-h-full md:rounded-3xl md:p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mb-3 h-1 w-10 rounded-full bg-border md:hidden" }),
						phase === "search" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileSearch, {
							originQuery,
							setOriginQuery,
							onSelectOrigin: handleSelectOrigin,
							onUseGpsOrigin: gpsCoord ? handleUseGpsOrigin : void 0,
							destinationQuery: query,
							setDestinationQuery: setQuery,
							onSelectDestination: handleSelectDestination,
							onAnalyze: handleAnalyze,
							originLabel,
							hasUserGeo,
							gpsAvailable: Boolean(gpsCoord),
							originCoord: originCoord ?? void 0
						}) : null,
						phase === "analyzing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalyzingPanel, {
							stage,
							destination
						}) : null,
						phase === "routes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoutesPanel, {
							routes,
							selectedId,
							onSelect: setSelectedId,
							destination,
							whyOpen,
							setWhyOpen,
							selectionResult,
							routeError,
							onStart: () => {
								setPhase("navigating");
								setStepIndex(0);
								setRerouteState("idle");
							},
							onBack: () => {
								setPhase("search");
								setRouteError(null);
							}
						}) : null,
						phase === "navigating" && selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavigationPanel, {
							route: selected,
							stepIndex,
							rerouteState,
							coolerRouteOption,
							coolerSlotLabel,
							rerouteNotice,
							isTriggeringReroute,
							onTriggerReroute: triggerSimulatedConditionChange,
							onAccept: acceptReroute,
							onDecline: () => setRerouteState("declined"),
							onNext: () => setStepIndex((i) => i + 1),
							onArrive: () => setPhase("arrived"),
							onExit: () => {
								setPhase("routes");
								setRerouteState("idle");
								setRerouteNotice(null);
							}
						}) : null,
						phase === "arrived" && selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrivedPanel, {
							destination,
							route: selected,
							onDone: () => {
								setPhase("search");
								setStepIndex(0);
								setRerouteState("idle");
							}
						}) : null
					]
				}, phase)
			})
		]
	});
}
function TopBar({ temp, routingSource, thermalSource }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-3 p-3 sm:p-4 md:p-6 md:pr-[452px] pointer-events-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/",
			className: "pointer-events-auto flex items-center gap-2 rounded-full border border-border/80 bg-void/95 px-3 py-1.5 shadow-lg backdrop-blur-md transition-opacity hover:opacity-90",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-7 w-7 shrink-0 place-items-center rounded-full shadow-ember-glow",
				style: { background: "var(--gradient-heat-cta)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-3.5 w-3.5 text-primary-foreground" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-sm font-bold tracking-tight text-foreground sm:text-base",
				children: "HeatRoute"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto flex items-center gap-2",
			children: [
				routingSource ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "hidden items-center gap-1.5 rounded-full border border-border/80 bg-void/95 px-3 py-1.5 font-mono text-[11px] text-muted-foreground shadow-lg backdrop-blur-md sm:flex",
					title: "Routing Engine Tier",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-1.5 w-1.5 rounded-full",
							style: { background: routingSource === "OpenRouteService" ? "var(--safe)" : routingSource === "OSM fallback" ? "var(--balanced)" : "var(--hot)" }
						}),
						"Routing: ",
						routingSource
					]
				}) : null,
				thermalSource ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "hidden items-center gap-1.5 rounded-full border border-border/80 bg-void/95 px-3 py-1.5 font-mono text-[11px] text-muted-foreground shadow-lg backdrop-blur-md sm:flex",
					title: "Temperature Grid Tier",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-1.5 w-1.5 rounded-full",
							style: { background: thermalSource === "FortyGuard Live" ? "var(--safe)" : thermalSource === "cache" ? "var(--balanced)" : "var(--hot)" }
						}),
						"Thermal: ",
						thermalSource
					]
				}) : null,
				temp !== void 0 && temp !== null && temp > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					title: "Peak street-level temperature along selected route",
					className: "flex items-center gap-1.5 rounded-full border border-border/80 bg-void/95 px-2.5 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-md sm:px-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thermometer, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono",
						children: [temp.toFixed(1), "°C"]
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/heat-intelligence",
					title: "Heat Intelligence 12-hour outlook",
					className: "flex items-center gap-1.5 rounded-full border border-border/80 bg-void/95 px-2.5 py-1.5 text-xs font-medium shadow-lg backdrop-blur-md transition-colors hover:border-primary/60 hover:text-primary sm:px-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "Heat Intelligence"
					})]
				})
			]
		})]
	});
}
function SearchPanel({ originQuery, setOriginQuery, onSelectOrigin, onUseGpsOrigin, destinationQuery, setDestinationQuery, onSelectDestination, onAnalyze, originLabel, destination, hasUserGeo, gpsAvailable, originCoord, phase }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-panel rounded-2xl p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "label-xs mb-3",
			children: phase === "search" ? "Plan a walk" : "Trip Summary"
		}), phase === "search" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DualSearchFields, {
			originQuery,
			setOriginQuery,
			onSelectOrigin,
			onUseGpsOrigin,
			destinationQuery,
			setDestinationQuery,
			onSelectDestination,
			onAnalyze,
			originLabel,
			hasUserGeo,
			gpsAvailable,
			originCoord
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2 text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 shrink-0 rounded-full bg-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate text-muted-foreground",
					children: originLabel || "Start location"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
					className: "h-3.5 w-3.5 shrink-0",
					style: { color: "var(--scorch)" }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate font-medium text-foreground",
					children: destination || "Destination"
				})]
			})]
		})]
	});
}
function MobileSearch({ originQuery, setOriginQuery, onSelectOrigin, onUseGpsOrigin, destinationQuery, setDestinationQuery, onSelectDestination, onAnalyze, originLabel, hasUserGeo, gpsAvailable, originCoord }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "md:hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mb-1 text-xl font-bold",
				children: "Plan your walk"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 text-sm text-muted-foreground",
				children: "Compare walking routes by street-level heat anywhere in the US."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DualSearchFields, {
				originQuery,
				setOriginQuery,
				onSelectOrigin,
				onUseGpsOrigin,
				destinationQuery,
				setDestinationQuery,
				onSelectDestination,
				onAnalyze,
				originLabel,
				hasUserGeo,
				gpsAvailable,
				originCoord
			})
		]
	});
}
function DualSearchFields({ originQuery, setOriginQuery, onSelectOrigin, onUseGpsOrigin, destinationQuery, setDestinationQuery, onSelectDestination, onAnalyze, originLabel, hasUserGeo, gpsAvailable, originCoord }) {
	const [originSuggestions, setOriginSuggestions] = (0, import_react.useState)([]);
	const [destSuggestions, setDestSuggestions] = (0, import_react.useState)([]);
	const [originLoading, setOriginLoading] = (0, import_react.useState)(false);
	const [destLoading, setDestLoading] = (0, import_react.useState)(false);
	const [originSource, setOriginSource] = (0, import_react.useState)("OpenRouteService");
	const [destSource, setDestSource] = (0, import_react.useState)("OpenRouteService");
	const originTimer = (0, import_react.useRef)(null);
	const destTimer = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const trimmed = originQuery.trim();
		if (!trimmed || trimmed === "Current GPS location" || trimmed.length < 2) {
			setOriginSuggestions([]);
			setOriginLoading(false);
			return;
		}
		if (originTimer.current) clearTimeout(originTimer.current);
		setOriginLoading(true);
		originTimer.current = setTimeout(() => {
			searchPlaces({ data: { text: trimmed } }).then((res) => {
				setOriginSuggestions(res.suggestions || []);
				setOriginSource(res.source);
			}).catch(() => {
				setOriginSuggestions([]);
				setOriginSource("fallback");
			}).finally(() => setOriginLoading(false));
		}, 300);
		return () => {
			if (originTimer.current) clearTimeout(originTimer.current);
		};
	}, [originQuery]);
	(0, import_react.useEffect)(() => {
		const trimmed = destinationQuery.trim();
		if (!trimmed || trimmed.length < 2) {
			setDestSuggestions([]);
			setDestLoading(false);
			return;
		}
		if (destTimer.current) clearTimeout(destTimer.current);
		setDestLoading(true);
		destTimer.current = setTimeout(() => {
			searchPlaces({ data: {
				text: trimmed,
				focusPoint: originCoord
			} }).then((res) => {
				setDestSuggestions(res.suggestions || []);
				setDestSource(res.source);
			}).catch(() => {
				setDestSuggestions([]);
				setDestSource("fallback");
			}).finally(() => setDestLoading(false));
		}, 300);
		return () => {
			if (destTimer.current) clearTimeout(destTimer.current);
		};
	}, [destinationQuery, originCoord]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-[11px] font-semibold text-muted-foreground",
						children: "Starting point"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 py-2.5",
						children: [
							originLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 shrink-0 animate-spin text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-2.5 w-2.5 shrink-0 rounded-full",
								style: { background: hasUserGeo ? "var(--safe)" : "var(--cool)" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: originQuery,
								onChange: (e) => setOriginQuery(e.target.value),
								placeholder: "Starting location (or use GPS)",
								className: "min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
							}),
							originQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setOriginQuery("");
									setOriginSuggestions([]);
								},
								"aria-label": "Clear start location",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4 text-muted-foreground" })
							}),
							gpsAvailable && !hasUserGeo && onUseGpsOrigin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: onUseGpsOrigin,
								title: "Use GPS current location",
								className: "flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-[10px] font-mono text-emerald-400 hover:bg-secondary/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocateFixed, { className: "h-3 w-3" }), " GPS"]
							})
						]
					}),
					originSuggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-xl border border-border/80 bg-popover shadow-lg animate-in fade-in-50 zoom-in-95",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border/50 bg-secondary/30 px-3 py-1 text-[10px] font-medium text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Start locations" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-emerald-400",
								children: "OpenRouteService"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-h-40 overflow-y-auto p-1",
							children: originSuggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									onSelectOrigin(s.name, s.coordinates);
									setOriginSuggestions([]);
								},
								className: "flex w-full items-start gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-secondary/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-xs font-semibold text-foreground",
										children: s.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-[10px] text-muted-foreground",
										children: s.label
									})]
								})]
							}, s.id))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-[11px] font-semibold text-muted-foreground",
						children: "Destination"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 py-2.5",
						children: [
							destLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 shrink-0 animate-spin text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: destinationQuery,
								onChange: (e) => setDestinationQuery(e.target.value),
								placeholder: "Where are you going?",
								className: "min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
							}),
							destinationQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setDestinationQuery("");
									setDestSuggestions([]);
								},
								"aria-label": "Clear destination",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4 text-muted-foreground" })
							})
						]
					}),
					destSuggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-xl border border-border/80 bg-popover shadow-lg animate-in fade-in-50 zoom-in-95",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border/50 bg-secondary/30 px-3 py-1 text-[10px] font-medium text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Suggested destinations" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-emerald-400",
								children: "OpenRouteService"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-h-40 overflow-y-auto p-1",
							children: destSuggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									onSelectDestination(s.name, s.coordinates);
									setDestSuggestions([]);
								},
								className: "flex w-full items-start gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-secondary/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-xs font-semibold text-foreground",
										children: s.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-[10px] text-muted-foreground",
										children: s.label
									})]
								})]
							}, s.id))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between rounded-xl border border-border/60 px-3 py-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footprints, { className: "h-3.5 w-3.5 text-muted-foreground" }), " Walking Mode"]
				}), hasUserGeo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1 font-mono text-[10px] text-emerald-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocateFixed, { className: "h-3 w-3" }), " GPS Connected"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onAnalyze,
				disabled: !destinationQuery.trim(),
				className: "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-40",
				style: { background: "var(--gradient-heat-cta)" },
				children: ["Analyse heat on this walk ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
			})
		]
	});
}
function AnalyzingPanel({ stage, destination }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-xs",
					children: "Analysing"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1 font-mono text-[10px] text-amber-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }), " Live API Query"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 truncate text-lg font-bold",
				children: destination
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 space-y-3",
				children: analysisStages.map((label, i) => {
					const done = stage > i;
					const activeStage = stage === i;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors duration-500",
							style: {
								borderColor: done ? "var(--safe)" : activeStage ? "var(--amber-warning, #f59e0b)" : "var(--border)",
								background: done ? "color-mix(in oklab, var(--safe) 22%, transparent)" : activeStage ? "color-mix(in oklab, var(--amber-warning, #f59e0b) 15%, transparent)" : "transparent"
							},
							children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-1.5 w-1.5 rounded-full",
								style: { background: "var(--safe)" }
							}) : activeStage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
								className: "h-2.5 w-2.5 animate-spin",
								style: { color: "var(--amber-warning, #f59e0b)" }
							}) : null
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 flex-1 truncate transition-colors duration-500",
							style: {
								color: done ? "var(--foreground)" : activeStage ? "var(--foreground)" : "var(--muted-foreground)",
								fontWeight: activeStage ? 600 : 400
							},
							children: label
						})]
					}, label);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 h-1 overflow-hidden rounded-full bg-secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full transition-all duration-500",
					style: {
						width: `${Math.min(100, Math.max(15, stage / analysisStages.length * 100))}%`,
						background: "var(--gradient-heat-cta)"
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted-foreground",
				children: "Querying OpenRouteService paths & FortyGuard thermal raster data..."
			})
		]
	});
}
function RoutesPanel({ routes, selectedId, onSelect, destination, whyOpen, setWhyOpen, selectionResult, routeError, onStart, onBack }) {
	if (routes.length === 0 || routeError) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-xs",
					children: "No Route Available"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onBack,
					"aria-label": "Back to search",
					className: "rounded-full p-2 hover:bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 truncate text-lg font-bold",
				children: destination
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-auto grid h-12 w-12 place-items-center rounded-full",
						style: { background: "color-mix(in oklab, var(--hot) 20%, transparent)" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
							className: "h-6 w-6",
							style: { color: "var(--hot)" }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-3 text-base font-bold text-foreground",
						children: "No walking route found"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-xs text-muted-foreground leading-relaxed",
						children: routeError || "Destination is too far to walk from your current origin. Please try a closer destination in the same metro area."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onBack,
						className: "mt-5 w-full rounded-xl border border-border bg-secondary/80 px-4 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors",
						children: "Try a closer destination"
					})
				]
			})
		]
	});
	const { rationale, highHeatThresholdC } = routeAnalysis;
	const selected = routes.find((r) => r.id === selectedId);
	const liveExtraTravel = selectionResult?.tradeoff.extraTravelMin ?? rationale.tradeoff.extraTravelMin;
	const liveHeatSaved = selectionResult?.tradeoff.heatMinutesSaved ?? rationale.tradeoff.heatMinutesSaved;
	const recommendedRoute = selectionResult ? routes.find((r) => r.id === selectionResult.recommendedId) : routes.find((r) => r.recommended);
	const fastestRoute = routes.find((r) => r.kind === "fastest");
	const showTradeoff = recommendedRoute && fastestRoute && recommendedRoute.id !== fastestRoute.id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-xs",
						children: "Choose your route"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 truncate text-lg font-bold",
						children: destination
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [
							"Ranked by lowest time above ",
							highHeatThresholdC,
							"°C"
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onBack,
				"aria-label": "Back to search",
				className: "rounded-full p-2 hover:bg-secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })
			})]
		}),
		selectionResult?.isNearTie && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex items-start gap-2.5 rounded-xl border p-2.5 text-xs leading-relaxed animate-in fade-in-50",
			style: {
				background: "color-mix(in oklab, var(--amber-warning, #f59e0b) 14%, transparent)",
				borderColor: "color-mix(in oklab, var(--amber-warning, #f59e0b) 40%, transparent)",
				color: "var(--foreground)"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] font-bold",
				style: {
					background: "var(--amber-warning, #f59e0b)",
					color: "#18181b"
				},
				children: "≈"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-semibold",
				style: { color: "var(--amber-warning, #f59e0b)" },
				children: ["Near-Tie Condition:", " "]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Both routes have effectively identical heat exposure (≤1 min difference). Recommendation is based on marginal score." })] })]
		}),
		selectionResult?.usedTimeBudgetFallback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex items-start gap-2.5 rounded-xl border p-2.5 text-xs leading-relaxed animate-in fade-in-50",
			style: {
				background: "color-mix(in oklab, var(--hot) 12%, transparent)",
				borderColor: "color-mix(in oklab, var(--hot) 30%, transparent)",
				color: "var(--foreground)"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] font-bold",
				style: {
					background: "var(--hot)",
					color: "var(--background)"
				},
				children: "!"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-semibold",
				style: { color: "var(--hot)" },
				children: ["Time-Budget Limit:", " "]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "No meaningfully cooler route exists within +20% travel time. Fastest route selected." })] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 space-y-2.5",
			children: routes.map((route) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouteCard, {
				route,
				selected: route.id === selectedId,
				onSelect,
				isNearTie: Boolean(selectionResult?.isNearTie)
			}, route.id))
		}),
		showTradeoff ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid grid-cols-2 gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tradeoff, {
				value: liveExtraTravel >= 0 ? `+${liveExtraTravel} min` : `${liveExtraTravel} min`,
				label: "vs Fastest: travel time",
				color: liveExtraTravel > 0 ? "var(--hot)" : "var(--safe)",
				up: liveExtraTravel > 0
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tradeoff, {
				value: liveHeatSaved >= 0 ? `−${liveHeatSaved} min` : `+${Math.abs(liveHeatSaved)} min`,
				label: "vs Fastest: high-heat",
				color: liveHeatSaved > 0 ? "var(--safe)" : "var(--hot)"
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 overflow-hidden rounded-xl border border-border/70",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setWhyOpen(!whyOpen),
				className: "flex w-full items-center justify-between gap-2 px-3 py-3 text-left text-sm font-medium hover:bg-secondary/40",
				"aria-expanded": whyOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex min-w-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "h-4 w-4 shrink-0",
						style: { color: "var(--safe)" }
					}), "Why this route?"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
					className: "h-4 w-4 shrink-0 transition-transform duration-300",
					style: { transform: whyOpen ? "rotate(90deg)" : void 0 }
				})]
			}), whyOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "animate-sheet-up space-y-3 border-t border-border/70 px-3 py-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						term: "Goal",
						detail: rationale.goal
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						term: "Routes evaluated",
						detail: String(routes.length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						term: "Temperature intelligence",
						detail: rationale.dataSource
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						term: "Selected",
						detail: selectionResult?.selectedLabel ?? rationale.selected
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						term: "Reason",
						detail: selectionResult?.reason ?? rationale.reason
					}),
					selectionResult && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-lg p-2.5 text-xs",
						style: {
							background: selectionResult.usedTimeBudgetFallback ? "color-mix(in oklab, var(--hot) 12%, transparent)" : selectionResult.isNearTie ? "color-mix(in oklab, var(--balanced) 14%, transparent)" : "color-mix(in oklab, var(--safe) 12%, transparent)",
							color: selectionResult.usedTimeBudgetFallback ? "var(--hot)" : selectionResult.isNearTie ? "var(--balanced)" : "var(--safe)"
						},
						children: selectionResult.usedTimeBudgetFallback ? "No meaningfully safer route was available within the 20% time budget." : selectionResult.isNearTie ? "⚠ Near-tie detected — routes show marginal heat exposure difference (< 1 min). Differences are not meaningful." : selectionResult.tradeoff.reductionPct > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							selectionResult.tradeoff.reductionPct,
							"% less high-heat exposure than the fastest route, for",
							" ",
							liveExtraTravel >= 0 ? `${liveExtraTravel} extra minute${liveExtraTravel !== 1 ? "s" : ""} of walking.` : `${Math.abs(liveExtraTravel)} fewer minute${Math.abs(liveExtraTravel) !== 1 ? "s" : ""} of walking.`
						] }) : "This route has the same or lower heat exposure as all other options."
					})
				]
			}) : null]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: onStart,
			className: "mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold",
			style: {
				background: routeAccent[selected?.kind ?? "heat-safe"],
				color: "var(--safe-foreground)"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "h-4 w-4" }), " Start navigation"]
		})
	] });
}
function Tradeoff({ value, label, color, up }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border/70 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "font-mono text-sm font-semibold",
			style: { color },
			children: [
				up ? "▲" : "▼",
				" ",
				value
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "label-xs mt-1 text-[10px]",
			children: label
		})]
	});
}
function Fact({ term, detail }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "label-xs",
		children: term
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-1 text-sm text-foreground/90",
		children: detail
	})] });
}
function NavigationPanel({ route, stepIndex, rerouteState, coolerRouteOption, coolerSlotLabel, rerouteNotice, isTriggeringReroute, onTriggerReroute, onNext, onArrive, onAccept, onDecline, onExit }) {
	const activeSteps = route.steps && route.steps.length > 0 ? route.steps : navSteps;
	const totalSteps = activeSteps.length;
	const isLastStep = stepIndex >= totalSteps - 1;
	const step = activeSteps[Math.min(stepIndex, totalSteps - 1)];
	const completedFraction = totalSteps > 1 ? stepIndex / (totalSteps - 1) : 0;
	const remainingFraction = 1 - completedFraction;
	const remainingMin = Math.max(1, Math.round(route.metrics.durationMin * remainingFraction));
	const remainingKm = Math.max(.1, Number((route.metrics.distanceKm * remainingFraction).toFixed(1)));
	const exposurePct = Math.round(completedFraction * 100);
	const heatSavedMin = Math.max(0, route.metrics.highHeatMinutes - coolerRouteOption.metrics.highHeatMinutes);
	const extraTravelMin = coolerRouteOption.metrics.durationMin - route.metrics.durationMin;
	if (rerouteState === "offered") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "animate-sheet-up py-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-10 w-10 shrink-0 place-items-center rounded-full",
					style: {
						background: "rgba(255, 138, 61, 0.16)",
						border: "1px solid rgba(255, 138, 61, 0.3)"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "h-5 w-5",
						style: { color: "var(--ember-glow)" }
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold leading-snug",
						children: "Route conditions changed"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate text-xs text-muted-foreground",
						children: [
							"Cooler route window available (",
							coolerSlotLabel || "Evening Forecast",
							")"
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-2xl border border-border/80 bg-secondary/40 p-3.5 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "Walk time",
							value: `${coolerRouteOption.metrics.durationMin} min`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "Peak temp",
							value: `${coolerRouteOption.metrics.peakTempC.toFixed(1)}°C`,
							color: "var(--safe)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "High heat",
							value: `${coolerRouteOption.metrics.highHeatMinutes} min`,
							color: "var(--safe)"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs",
					style: { color: "var(--safe)" },
					children: heatSavedMin > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"Saves ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono font-semibold",
							children: [heatSavedMin, " min"]
						}),
						" of high-heat exposure",
						" ",
						extraTravelMin > 0 ? `for ${extraTravelMin} extra min of walking.` : "with no extra walk time."
					] }) : `Lower peak temperature (${coolerRouteOption.metrics.peakTempC.toFixed(1)}°C) along the path.`
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onAccept,
					className: "rounded-xl px-4 py-3 text-sm font-semibold transition-transform active:scale-[0.98]",
					style: {
						background: "var(--safe)",
						color: "var(--safe-foreground)"
					},
					children: "Reroute onto cooler alternative"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onDecline,
					className: "rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-secondary/60",
					children: "Keep current route"
				})]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "label-xs",
							children: [
								"In ",
								step.inMeters,
								" m · Step ",
								stepIndex + 1,
								" of ",
								totalSteps
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 text-xl font-bold leading-tight",
							children: step.instruction
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 truncate text-xs text-muted-foreground",
							children: step.detail
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onExit,
					"aria-label": "End navigation",
					className: "rounded-full p-2 hover:bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center justify-between rounded-xl border border-dashed border-amber-500/50 bg-amber-500/10 p-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1 pr-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold text-amber-400",
						children: "Simulate Conditions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-[10px] text-muted-foreground",
						children: "Check for cooler forecast windows"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onTriggerReroute,
					disabled: isTriggeringReroute,
					className: "flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-500/20 px-2.5 py-1.5 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-500/30 disabled:opacity-50",
					children: [isTriggeringReroute ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Simulate condition change" })]
				})]
			}),
			rerouteNotice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "animate-sheet-up mt-3 rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-xs text-muted-foreground",
				children: rerouteNotice
			}) : null,
			rerouteState === "accepted" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "animate-sheet-up mt-3 rounded-lg px-3 py-2 text-xs",
				style: {
					background: "color-mix(in oklab, var(--safe) 14%, transparent)",
					color: "var(--safe)"
				},
				children: [
					"✓ Rerouted onto the cooler alternative (",
					coolerSlotLabel || "Evening slot",
					")."
				]
			}) : null,
			rerouteState === "declined" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "animate-sheet-up mt-3 rounded-lg bg-secondary/40 px-3 py-2 text-xs text-muted-foreground",
				children: "Staying on original route. You can simulate again using the demo button above."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-3 gap-3 border-t border-border/70 pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Remaining",
						value: `${remainingMin} min`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Distance left",
						value: `${remainingKm} km`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Current heat",
						value: `${route.metrics.avgTempC.toFixed(1)}°C`,
						color: route.metrics.avgTempC >= 36 ? "var(--hot)" : "var(--safe)"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-xs",
						children: "Exposure on this route"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-xs",
						style: { color: "var(--safe)" },
						children: [route.metrics.highHeatMinutes, " min above 36°C"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full transition-all duration-500",
						style: {
							width: `${exposurePct}%`,
							background: routeAccent[route.kind]
						}
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 max-h-[160px] overflow-y-auto border-t border-border/70 pt-3 pr-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "space-y-2",
					children: activeSteps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2 text-xs",
						style: {
							color: i === stepIndex ? "var(--foreground)" : "var(--muted-foreground)",
							opacity: i < stepIndex ? .4 : 1
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-1.5 w-1.5 shrink-0 rounded-full",
							style: { background: i === stepIndex ? routeAccent[route.kind] : i < stepIndex ? "var(--safe)" : "var(--border)" }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `truncate ${i < stepIndex ? "line-through" : ""}`,
							children: s.instruction
						})]
					}, `${s.instruction}-${i}`))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky bottom-0 z-10 mt-4 border-t border-border/60 bg-background/95 pt-3 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: isLastStep ? onArrive : onNext,
					className: "w-full rounded-xl px-4 py-3 text-sm font-semibold shadow-md transition-all active:scale-[0.98]",
					style: isLastStep ? {
						background: "var(--safe)",
						color: "var(--safe-foreground)"
					} : {
						background: "var(--foreground)",
						color: "var(--background)"
					},
					children: isLastStep ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4" }), "I've arrived"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center justify-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" }),
							"Next step (",
							stepIndex + 1,
							"/",
							totalSteps,
							")"
						]
					})
				})
			})
		]
	});
}
function ArrivedPanel({ destination, route, onDone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "animate-sheet-up flex flex-col items-center py-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-16 w-16 place-items-center rounded-full",
				style: { background: "color-mix(in oklab, var(--safe) 20%, transparent)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
					className: "h-8 w-8",
					style: { color: "var(--safe)" }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-5 text-2xl font-bold leading-tight",
				children: "You've arrived"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-[240px] truncate text-sm text-muted-foreground",
				children: destination
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid w-full grid-cols-2 gap-3 rounded-2xl border border-border/70 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-2xl font-bold tabular-nums",
							style: { color: "var(--foreground)" },
							children: route.metrics.durationMin
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: "min total walk"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-2xl font-bold tabular-nums",
							style: { color: route.metrics.highHeatMinutes > 0 ? "var(--hot)" : "var(--safe)" },
							children: route.metrics.highHeatMinutes
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: "min above 36°C"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-2xl font-bold tabular-nums",
							style: { color: "var(--foreground)" },
							children: route.metrics.distanceKm.toFixed(1)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: "km walked"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-2xl font-bold tabular-nums",
							style: { color: "var(--safe)" },
							children: [route.metrics.peakTempC.toFixed(1), "°C"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: "peak temp"
						})]
					})
				]
			}),
			route.metrics.highHeatMinutes === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm",
				style: { color: "var(--safe)" },
				children: "✓ Zero high-heat exposure on this walk."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-xs text-muted-foreground",
				children: [
					"You spent",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold",
						style: { color: "var(--hot)" },
						children: [route.metrics.highHeatMinutes, " min"]
					}),
					" ",
					"in conditions above 36°C."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onDone,
				className: "mt-6 w-full rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary/60",
				children: "Back to search"
			})
		]
	});
}
function Metric({ label, value, color, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "flex items-center gap-1 font-mono text-sm font-semibold",
			style: { color: color ?? "var(--foreground)" },
			children: [icon, value]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "label-xs mt-0.5 truncate text-[10px]",
			children: label
		})]
	});
}
//#endregion
export { HeatRouteApp as component };
