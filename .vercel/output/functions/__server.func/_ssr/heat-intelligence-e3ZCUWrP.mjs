import { r as __toESM } from "../_runtime.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as ThermalMap, o as getRouteForecast, t as ThermalLegend } from "./fortyguard-DdQO2_QR.mjs";
import { T as ArrowLeft, a as Thermometer, b as Clock, h as LoaderCircle, n as Wind, o as Sun, v as Flame, w as ArrowRight, x as CircleAlert, y as Compass } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/heat-intelligence-e3ZCUWrP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HeatIntelligence() {
	const [routeContext, setRouteContext] = (0, import_react.useState)(null);
	const [forecastResult, setForecastResult] = (0, import_react.useState)(null);
	const [forecastLoading, setForecastLoading] = (0, import_react.useState)(false);
	const [hasCheckedSession, setHasCheckedSession] = (0, import_react.useState)(false);
	const [selected, setSelected] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let active = true;
		let savedContext = null;
		try {
			const raw = sessionStorage.getItem("heatroute_last_analyzed");
			if (raw) {
				savedContext = JSON.parse(raw);
				setRouteContext(savedContext);
			}
		} catch {}
		setHasCheckedSession(true);
		if (!savedContext || !savedContext.coordinates || savedContext.coordinates.length === 0) return;
		try {
			const prewarmed = sessionStorage.getItem("heatroute_prewarmed_forecast");
			if (prewarmed) {
				const parsed = JSON.parse(prewarmed);
				const forecastKey = parsed?.routeKey;
				const contextKey = savedContext?.routeKey;
				if (forecastKey && contextKey && forecastKey === contextKey && parsed?.slots && parsed.slots.length > 0) {
					setForecastResult(parsed);
					setForecastLoading(false);
					return;
				}
				sessionStorage.removeItem("heatroute_prewarmed_forecast");
			}
		} catch {}
		setForecastLoading(true);
		getRouteForecast({ data: {
			routeCoordinates: savedContext.coordinates,
			durationMin: savedContext.durationMin || 20,
			currentTiles: savedContext.tiles
		} }).then((res) => {
			if (active) {
				setForecastResult(res);
				try {
					sessionStorage.setItem("heatroute_prewarmed_forecast", JSON.stringify({
						...res,
						routeKey: savedContext?.routeKey
					}));
				} catch {}
			}
		}).catch((err) => {
			console.warn("[Heat Intelligence] Fetch forecast error:", err);
		}).finally(() => {
			if (active) setForecastLoading(false);
		});
		return () => {
			active = false;
		};
	}, []);
	const immediateSlots = (0, import_react.useMemo)(() => {
		if (!routeContext) return [];
		const basePeak = routeContext.metrics?.peakTempC ?? 26;
		const baseAvg = routeContext.metrics?.avgTempC ?? basePeak - 1.2;
		const baseHighHeat = routeContext.metrics?.highHeatMinutes ?? 0;
		const diurnalDeltas = {
			0: 0,
			3: -.8,
			6: -3.6,
			9: -6.4,
			12: -8.9
		};
		const nowDate = /* @__PURE__ */ new Date();
		return [
			0,
			3,
			6,
			9,
			12
		].map((offsetHours) => {
			const slotTime = new Date(nowDate.getTime() + offsetHours * 60 * 60 * 1e3);
			const displayHour = slotTime.getUTCHours();
			const ampm = displayHour >= 12 ? "PM" : "AM";
			const displayTime = `${displayHour % 12 === 0 ? 12 : displayHour % 12}:00 ${ampm}`;
			const label = offsetHours === 0 ? "Now" : `+${offsetHours}h`;
			const delta = diurnalDeltas[offsetHours] ?? 0;
			const peakTempC = Number((basePeak + delta).toFixed(1));
			const avgTempC = Number((baseAvg + delta).toFixed(1));
			const highHeatMinutes = peakTempC >= 36 ? Math.max(0, Math.round(baseHighHeat * (peakTempC >= 38 ? 1 : .4))) : 0;
			return {
				label: `${label} (${displayTime})`,
				offsetHours,
				timeString: `${String(slotTime.getUTCHours()).padStart(2, "0")}:00`,
				available: true,
				peakTempC,
				avgTempC,
				highHeatMinutes
			};
		});
	}, [routeContext, 36]);
	const slots = forecastResult?.slots && forecastResult.slots.length > 0 && forecastResult.slots.some((s) => s.available && s.peakTempC !== void 0) ? forecastResult.slots : immediateSlots;
	const tiles = forecastResult?.tiles && forecastResult.tiles.length > 0 ? forecastResult.tiles : routeContext?.tiles || [];
	const availableSlots = slots.filter((s) => s.available && s.peakTempC !== void 0);
	const nowSlot = slots.find((s) => s.offsetHours === 0) || slots[0];
	const coolestSlot = forecastResult?.coolestSlot || (availableSlots.length > 0 ? [...availableSlots].sort((a, b) => a.peakTempC - b.peakTempC)[0] : void 0);
	const currentTemp = nowSlot?.peakTempC ?? routeContext?.metrics?.peakTempC ?? 26;
	const currentHighHeat = nowSlot?.highHeatMinutes ?? routeContext?.metrics?.highHeatMinutes ?? 0;
	const activePoint = slots[selected] || slots[0];
	const maxTemp = availableSlots.length > 0 ? Math.max(...availableSlots.map((f) => f.peakTempC)) : 38;
	const minTemp = availableSlots.length > 0 ? Math.min(...availableSlots.map((f) => f.peakTempC)) : 22;
	const previewRoute = (0, import_react.useMemo)(() => {
		if (!routeContext) return [];
		return [{
			id: "preview-route",
			kind: "heat-safe",
			label: `${routeContext.origin} → ${routeContext.destination}`,
			geometry: routeContext.coordinates,
			recommended: true,
			metrics: {
				durationMin: routeContext.durationMin,
				distanceKm: routeContext.distanceKm,
				peakTempC: currentTemp,
				avgTempC: nowSlot?.avgTempC ?? routeContext.metrics?.avgTempC ?? currentTemp,
				highHeatMinutes: currentHighHeat
			}
		}];
	}, [
		routeContext,
		currentTemp,
		currentHighHeat,
		nowSlot
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen bg-atmosphere-subtle text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-40 border-b border-border/40 bg-void/85 backdrop-blur-xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-4xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app",
						"aria-label": "Back to map",
						className: "rounded-full p-2 hover:bg-secondary transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "truncate font-display text-base font-bold tracking-tight",
							children: "Heat Intelligence"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: routeContext ? `${routeContext.origin} → ${routeContext.destination}` : "12-Hour Heat Outlook"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-8 w-8 shrink-0 place-items-center rounded-full shadow-ember-glow",
						style: { background: "var(--gradient-heat-cta)" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4 w-4 text-primary-foreground" })
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl space-y-6 px-5 py-6 pb-16",
			children: [hasCheckedSession && !routeContext ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "glass-panel rounded-3xl p-8 text-center sm:p-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary/80 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "h-7 w-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 font-display text-2xl font-bold",
						children: "No walk analyzed yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-2 max-w-md text-sm text-muted-foreground leading-relaxed",
						children: "Search a starting point and destination on the map first. Heat Intelligence will analyze the live street-level temperature grid and 12-hour departure forecast for your route."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/app",
							className: "flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02]",
							style: { background: "var(--gradient-heat-cta)" },
							children: ["Plan a walk on the map ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "glass-panel overflow-hidden rounded-3xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-64 sm:h-80 w-full",
						children: [
							previewRoute.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThermalMap, {
								routes: previewRoute,
								activeRouteId: "preview-route",
								tiles,
								className: "absolute inset-0 h-full w-full",
								fitBoundsPaddingRight: 60
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-full w-full place-items-center bg-secondary/30 text-sm text-muted-foreground",
								children: "Map preview unavailable"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pointer-events-none absolute inset-0",
								style: { background: "linear-gradient(180deg, transparent 40%, var(--card) 100%)" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pointer-events-none absolute top-4 left-4 z-10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThermalLegend, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-x-5 bottom-4 z-10 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 mb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-400 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "label-xs text-foreground/90",
												children: "Live Thermal Map · FortyGuard 2m"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-display text-4xl font-bold",
											children: [currentTemp.toFixed(1), "°C"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "truncate text-xs text-muted-foreground",
											children: [
												routeContext?.destination ?? "Walk Corridor",
												" · ",
												tiles.length > 0 ? `${tiles.length} heat tiles loaded` : "FortyGuard Real Grid"
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold",
									style: {
										background: currentTemp >= 36 ? "color-mix(in oklab, var(--hot) 18%, transparent)" : "color-mix(in oklab, var(--safe) 18%, transparent)",
										color: currentTemp >= 36 ? "var(--hot)" : "var(--safe)"
									},
									children: currentTemp >= 36 ? `Above 36°C in exposed areas` : `Below 36°C moderate heat`
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 divide-x divide-border border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thermometer, { className: "h-3.5 w-3.5" }),
								value: `${(currentTemp + 1.5).toFixed(1)}°C`,
								label: "Feels like"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-3.5 w-3.5" }),
								value: `−${Math.min(3.5, Math.max(1.2, currentTemp * .08)).toFixed(1)}°C`,
								label: "Shade delta"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wind, { className: "h-3.5 w-3.5" }),
								value: `36°C`,
								label: "High-heat threshold"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "glass-panel rounded-3xl p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-xs",
								children: "12-hour outlook"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 truncate text-lg font-bold",
								children: "Street-level forecast by departure window"
							})]
						}), forecastLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5 font-mono text-xs text-amber-400 animate-pulse",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }), " Querying FortyGuard…"]
						}) : activePoint && activePoint.available && activePoint.peakTempC !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "shrink-0 font-mono text-sm",
							style: { color: activePoint.peakTempC >= 38 ? "var(--hot)" : "var(--safe)" },
							children: [
								activePoint.peakTempC.toFixed(1),
								"°C · ",
								activePoint.label
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 font-mono text-xs text-muted-foreground",
							children: "Forecast unavailable"
						})]
					}), forecastLoading && slots.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-end gap-2 sm:gap-4 h-36",
							children: [...Array(5)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-w-0 flex-1 flex-col items-center gap-2 h-full justify-end",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-6 rounded bg-secondary/50 animate-pulse" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-full rounded-t-md bg-secondary/60 animate-pulse",
										style: {
											height: `${35 + i * 15}%`,
											opacity: .5 + i * .1
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-10 rounded bg-secondary/50 animate-pulse" })
								]
							}, i))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2 text-xs text-muted-foreground/90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-primary" }), "Reading FortyGuard 2m thermal resolution forecast across 5 departure windows..."]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 flex items-end gap-2 sm:gap-4",
						children: slots.map((f, i) => {
							const active = i === selected;
							if (!f.available || f.peakTempC === void 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setSelected(i),
								className: "group flex min-w-0 flex-1 flex-col items-center gap-2",
								"aria-pressed": active,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[9px] text-muted-foreground",
										children: "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-16 w-full items-center justify-center rounded-t-md border border-dashed border-border/80 bg-secondary/20",
										title: "Forecast unavailable",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5 text-muted-foreground/60" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "label-xs truncate text-[9px] tracking-normal",
										style: { color: active ? "var(--foreground)" : void 0 },
										children: f.label
									})
								]
							}, f.label);
							const height = 30 + (f.peakTempC - minTemp) / (maxTemp - minTemp || 1) * 70;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setSelected(i),
								className: "group flex min-w-0 flex-1 flex-col items-center gap-2",
								"aria-pressed": active,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-[10px] text-muted-foreground",
										children: [f.peakTempC.toFixed(0), "°"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-full rounded-t-md transition-all duration-500",
										style: {
											height: `${height * 1.4}px`,
											background: f.peakTempC >= 39 ? "var(--scorch)" : f.peakTempC >= 37 ? "var(--hot)" : f.peakTempC >= 35 ? "var(--warm)" : "var(--safe)",
											opacity: active ? 1 : .45
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "label-xs truncate text-[9px] tracking-normal",
										style: { color: active ? "var(--foreground)" : void 0 },
										children: f.label
									})
								]
							}, f.label);
						})
					}), activePoint && activePoint.available && activePoint.highHeatMinutes !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-5 text-sm text-muted-foreground",
						children: [
							"Departing at ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: activePoint.label
							}),
							" results in approximately",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono font-semibold",
								style: { color: activePoint.peakTempC && activePoint.peakTempC >= 38 ? "var(--hot)" : "var(--safe)" },
								children: [activePoint.highHeatMinutes, " min"]
							}),
							" ",
							"exposure above ",
							36,
							"°C along your route."
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-sm text-muted-foreground",
						children: "Real forecast data unavailable for this window."
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "grid gap-3 sm:grid-cols-2",
					children: forecastLoading && !nowSlot ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border/60 bg-secondary/15 p-5 animate-pulse",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-28 rounded bg-secondary/60" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-3 h-8 w-20 rounded bg-secondary/60" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-2 h-4 w-40 rounded bg-secondary/40" })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border/60 bg-secondary/15 p-5 animate-pulse",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-28 rounded bg-secondary/60" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-3 h-8 w-20 rounded bg-secondary/60" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-2 h-4 w-40 rounded bg-secondary/40" })
						]
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [nowSlot && nowSlot.available && nowSlot.peakTempC !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartureCard, {
						title: "Leave now (Peak Afternoon)",
						tempC: nowSlot.peakTempC,
						minutes: nowSlot.highHeatMinutes ?? 20,
						tone: nowSlot.peakTempC >= 38 ? "hot" : "safe",
						note: "Midday peak heat exposure"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartureUnavailableCard, { title: "Leave now" }), coolestSlot && coolestSlot.available && coolestSlot.peakTempC !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartureCard, {
						title: `Leave Later (${coolestSlot.label})`,
						tempC: coolestSlot.peakTempC,
						minutes: coolestSlot.highHeatMinutes ?? 0,
						tone: "safe",
						note: nowSlot?.peakTempC ? `${(nowSlot.peakTempC - coolestSlot.peakTempC).toFixed(1)}°C cooler than leaving now` : `Coolest window in next 12 hours`
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartureUnavailableCard, { title: "Leave later" })] })
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/app",
				className: "flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold text-primary-foreground",
				style: { background: "var(--gradient-heat-cta)" },
				children: ["Plan a heat-safe walk ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
			})]
		})]
	});
}
function Stat({ icon, value, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "flex items-center gap-1.5 font-mono text-sm font-semibold",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: icon
			}), value]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "label-xs mt-1 truncate text-[10px]",
			children: label
		})]
	});
}
function DepartureCard({ title, tempC, minutes, tone, note }) {
	const color = tone === "safe" ? "var(--safe)" : "var(--hot)";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border p-5",
		style: {
			borderColor: color,
			background: `color-mix(in oklab, ${color} 8%, var(--card))`
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em]",
				style: { color },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }),
					" ",
					title
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 font-display text-3xl font-bold",
				children: [tempC.toFixed(1), "°C"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono",
						style: { color },
						children: [minutes, " min"]
					}),
					" ",
					"high-heat exposure"
				]
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted-foreground",
				children: note
			}) : null
		]
	});
}
function DepartureUnavailableCard({ title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-dashed border-border/80 bg-secondary/10 p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }),
					" ",
					title
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-display text-2xl font-bold text-muted-foreground",
				children: "Forecast unavailable"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Live thermal data could not be retrieved for this slot."
			})
		]
	});
}
//#endregion
export { HeatIntelligence as component };
