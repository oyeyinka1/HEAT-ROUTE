import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as routeAnalysis } from "./heatroute-data-ClpyG0yJ.mjs";
import { _ as Footprints, a as Thermometer, c as ShieldCheck, f as MapPinned, i as Timer, u as Route, v as Flame, w as ArrowRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D9cKMJIH.js
var import_jsx_runtime = require_jsx_runtime();
var thermal_map_default = "/assets/thermal-map-Df4wSUBi.jpg";
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-atmosphere-landing text-foreground selection:bg-primary/30 selection:text-primary-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Problem, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoutePreview, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FortyGuard, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalCta, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function SiteHeader() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-50 border-b border-border/40 bg-void/80 backdrop-blur-xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:flex sm:justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex min-w-0 items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-8 w-8 shrink-0 place-items-center rounded-full shadow-ember-glow",
						style: { background: "var(--gradient-heat-cta)" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4 w-4 text-primary-foreground" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate font-display text-lg font-bold tracking-tight",
						children: "HeatRoute"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-7 text-sm text-muted-foreground md:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#problem",
							className: "transition-colors hover:text-foreground",
							children: "Why heat"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#how",
							className: "transition-colors hover:text-foreground",
							children: "How it works"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/heat-intelligence",
							className: "transition-colors hover:text-foreground",
							children: "Heat Intelligence"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app",
					className: "shrink-0 rounded-full px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]",
					style: { background: "var(--gradient-heat-cta)" },
					children: "Try HeatRoute"
				})
			]
		})
	});
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative min-h-[92vh] overflow-hidden bg-black flex flex-col justify-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/images/heat-reference.png",
				alt: "Urban heat route background",
				className: "absolute inset-0 h-full w-full object-cover object-[center_35%] pointer-events-none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 pointer-events-none",
				style: { background: "linear-gradient(to right, rgba(11,10,12,0.95) 0%, rgba(11,10,12,0.85) 35%, rgba(11,10,12,0.4) 65%, transparent 100%), linear-gradient(to bottom, rgba(11,10,12,0.6) 0%, transparent 25%, transparent 75%, #0B0A0C 100%)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-10 mx-auto w-full max-w-6xl px-6 py-28 sm:py-32 lg:py-36",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-[720px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-display text-[clamp(2.5rem,5.8vw,5.2rem)] font-extrabold leading-[1.04] tracking-tight",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-white whitespace-nowrap animate-rise-in",
								style: { animationDelay: "0ms" },
								children: "Navigate the city."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block whitespace-nowrap animate-rise-in",
								style: {
									background: "linear-gradient(95deg, #FF8A3D 0%, #E05A1A 55%, #C2410C 100%)",
									WebkitBackgroundClip: "text",
									WebkitTextFillColor: "transparent",
									backgroundClip: "text",
									animationDelay: "100ms"
								},
								children: "Not the heat."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 max-w-[500px] text-[1rem] leading-relaxed text-white/75 sm:text-[1.05rem] animate-rise-in",
							style: { animationDelay: "200ms" },
							children: "HeatRoute compares walking routes using hyperlocal temperature data and recommends the one with less high-heat exposure — without adding an unreasonable amount of time to your walk."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-9 flex flex-wrap items-center gap-4 animate-rise-in",
							style: { animationDelay: "300ms" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/app",
								className: "flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]",
								style: { background: "linear-gradient(135deg, #FF8A3D 0%, #C2410C 65%, #9A2C05 100%)" },
								children: ["Try HeatRoute ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/heat-intelligence",
								className: "flex items-center gap-2 rounded-xl border border-white/25 bg-black/30 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-black/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									className: "h-4 w-4 shrink-0",
									viewBox: "0 0 16 16",
									fill: "none",
									xmlns: "http://www.w3.org/2000/svg",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
											x: "1",
											y: "10",
											width: "2",
											height: "5",
											rx: "0.5",
											fill: "currentColor",
											opacity: "0.7"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
											x: "5",
											y: "6",
											width: "2",
											height: "9",
											rx: "0.5",
											fill: "currentColor",
											opacity: "0.85"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
											x: "9",
											y: "3",
											width: "2",
											height: "12",
											rx: "0.5",
											fill: "currentColor"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
											x: "13",
											y: "7",
											width: "2",
											height: "8",
											rx: "0.5",
											fill: "currentColor",
											opacity: "0.85"
										})
									]
								}), "Explore Heat Intelligence"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-14 flex flex-wrap items-start border-t border-white/15 pt-8 animate-rise-in",
							style: { animationDelay: "400ms" },
							children: [
								{
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thermometer, { className: "h-5 w-5" }),
									value: "2 m",
									label: "TEMPERATURE\nRESOLUTION"
								},
								{
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footprints, { className: "h-5 w-5" }),
									value: "Walking",
									label: "PURPOSE-BUILT\nMODE"
								},
								{
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "h-5 w-5" }),
									value: "12 h",
									label: "FORECAST\nHORIZON"
								},
								{
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" }),
									value: "Private",
									label: "BY DESIGN"
								}
							].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start",
								children: [i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-5 mt-0.5 h-11 w-px bg-white/18 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: { color: "#FF8A3D" },
										className: "shrink-0 mt-0.5",
										children: s.icon
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-xl font-bold text-white leading-none",
										children: s.value
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1.5 text-[9px] font-semibold uppercase tracking-widest text-white/50 whitespace-pre-line leading-[1.5]",
										children: s.label
									})] })]
								})]
							}, s.value))
						})
					]
				})
			})
		]
	});
}
function Problem() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "problem",
		className: "mx-auto max-w-6xl px-5 py-20 sm:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-xs",
					children: "The problem"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 text-3xl font-bold sm:text-4xl",
					children: "Two streets apart, the city can be a different climate."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-muted-foreground",
					children: "City temperature is not one number. Shade, tree cover, surface material and building geometry create street-level differences of several degrees within a single block. Every navigation app still routes you as if heat did not exist — straight down the hottest, most exposed corridor."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-7 space-y-4",
					children: [
						{
							title: "The fastest route is often the hottest",
							body: "Wide, unshaded avenues move you quickly and expose you the most."
						},
						{
							title: "Exposure is what harms you, not distance",
							body: "Minutes spent above a high-heat threshold is the number that matters."
						},
						{
							title: "Small detours change the outcome",
							body: "A few extra minutes on shaded segments can cut exposure substantially."
						}
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1.5 h-2 w-2 shrink-0 rounded-full",
							style: { background: "var(--hot)" }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: item.body
						})] })]
					}, item.title))
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-panel relative overflow-hidden rounded-3xl p-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: thermal_map_default,
					alt: "Hyperlocal thermal map showing hot corridors and cooler side streets",
					width: 1536,
					height: 1536,
					loading: "lazy",
					className: "aspect-square w-full rounded-2xl object-cover opacity-90"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-6 bottom-6 flex items-center gap-3 rounded-full px-4 py-2.5",
					style: {
						background: "var(--panel)",
						backdropFilter: "blur(16px)"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-xs shrink-0",
							children: "Cooler"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "thermal-bar h-1.5 flex-1 rounded-full" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-xs shrink-0",
							children: "Hotter"
						})
					]
				})]
			})]
		})
	});
}
function HowItWorks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "how",
		className: "relative py-20 sm:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-xs",
					children: "How it works"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 max-w-2xl text-3xl font-bold sm:text-4xl",
					children: "Transparent route intelligence, in three steps."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid gap-5 md:grid-cols-3",
					children: [
						{
							n: "01",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPinned, { className: "h-5 w-5" }),
							title: "Enter your destination",
							body: "Choose where you are walking. HeatRoute reads the current street-level temperature grid along every candidate path."
						},
						{
							n: "02",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, { className: "h-5 w-5" }),
							title: "Compare the tradeoff",
							body: "See fastest and heat-safe side by side: duration, distance, peak and average temperature, and minutes of high-heat exposure."
						},
						{
							n: "03",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footprints, { className: "h-5 w-5" }),
							title: "Walk the cooler route",
							body: "Start simplified navigation with live heat context, and get offered a cooler alternative if conditions change en route."
						}
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "glass-panel rounded-2xl p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-10 w-10 place-items-center rounded-xl",
									style: {
										background: "rgba(255, 138, 61, 0.14)",
										color: "var(--ember-glow)"
									},
									children: s.icon
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs text-muted-foreground",
									children: s.n
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-5 text-lg font-semibold",
								children: s.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: s.body
							})
						]
					}, s.n))
				})
			]
		})
	});
}
function RoutePreview() {
	const [fastest, heatSafe] = routeAnalysis.routes;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative mx-auto max-w-6xl px-5 py-20 sm:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-10 lg:grid-cols-2 lg:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-xs",
					children: "The decision"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 text-3xl font-bold sm:text-4xl",
					children: "You see the tradeoff, then you choose."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-muted-foreground",
					children: "HeatRoute never hides its reasoning behind a single opaque score. Every recommendation shows the exposure it saves, the time it costs, and why it was selected."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/app",
					className: "mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]",
					style: { background: "var(--gradient-heat-cta)" },
					children: ["See it on the map ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-panel space-y-3 rounded-3xl p-5 shadow-panel",
				children: [[fastest, heatSafe].map((route) => {
					const isSafe = route.kind === "heat-safe";
					const accent = isSafe ? "var(--safe)" : "var(--fastest)";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border p-4",
						style: {
							borderColor: isSafe ? accent : "var(--panel-border)",
							background: isSafe ? "color-mix(in oklab, var(--safe) 8%, transparent)" : "transparent"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold uppercase tracking-[0.14em]",
								style: { color: accent },
								children: route.label
							}), isSafe ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-semibold uppercase tracking-wider",
								style: { color: accent },
								children: "Recommended"
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4",
							children: [
								[`${route.metrics.durationMin} min`, "Walk time"],
								[`${route.metrics.distanceKm} km`, "Distance"],
								[`${route.metrics.peakTempC.toFixed(1)}°C`, "Peak temp"],
								[`${route.metrics.highHeatMinutes} min`, "High heat"]
							].map(([v, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-sm font-semibold",
								children: v
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-xs mt-0.5 text-[10px]",
								children: l
							})] }, l))
						})]
					}, route.id);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-1 text-xs text-muted-foreground",
					children: "Example comparison. Live values come from street-level temperature intelligence."
				})]
			})]
		})
	});
}
function FortyGuard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative py-20 sm:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1.2fr_1fr] lg:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-xs",
					children: "Powered by FortyGuard"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 text-3xl font-bold sm:text-4xl",
					children: "The temperature layer beneath every route."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-muted-foreground leading-relaxed",
					children: "FortyGuard provides hyperlocal, street-level temperature intelligence at roughly 2-metre resolution, plus short-horizon forecasts. HeatRoute turns that layer into a routing decision: it scores each candidate walking path segment by segment, estimates minutes of high-heat exposure, and recommends the coolest option that stays within an acceptable travel-time penalty."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [
					["Street-level", "Not city-wide averages"],
					["Segment scoring", "Exposure per path segment"],
					["12-hour forecast", "Leave now or leave later"],
					["Explainable", "No unexplained score"]
				].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-panel rounded-2xl p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-sm font-semibold",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: v
					})]
				}, k))
			})]
		})
	});
}
function FinalCta() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative mx-auto max-w-6xl overflow-hidden px-5 py-24 text-center sm:py-32",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute left-1/2 top-1/2 h-[350px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] opacity-25",
			style: { background: "radial-gradient(circle, #FF8A3D 0%, #C2410C 50%, transparent 80%)" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mx-auto max-w-2xl text-3xl font-bold sm:text-5xl tracking-tight",
					children: "Your next walk can be several degrees cooler."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-5 max-w-xl text-muted-foreground leading-relaxed",
					children: "Enter a destination and see the heat tradeoff before you step outside."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/app",
					className: "mt-9 inline-flex items-center gap-2 rounded-xl px-7 py-4 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]",
					style: { background: "var(--gradient-heat-cta)" },
					children: ["Try HeatRoute ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
				})
			]
		})]
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-border/20 bg-void/60 backdrop-blur-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-8 text-sm text-muted-foreground sm:flex sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "min-w-0 truncate",
				children: "HeatRoute — street-level temperature data from FortyGuard."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "shrink-0 font-mono text-xs",
				children: "Made for walkers."
			})]
		})
	});
}
//#endregion
export { Landing as component };
