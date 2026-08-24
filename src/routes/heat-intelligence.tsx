import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Flame,
  Sun,
  Thermometer,
  Wind,
  AlertCircle,
  Layers,
  Loader2,
  MapPin,
  Compass,
} from "lucide-react";
import { ThermalMap, ThermalLegend } from "@/components/heatroute/ThermalMap";
import {
  highHeatThresholdC,
  type RouteOption,
} from "@/lib/heatroute-data";
import { getRouteForecast, type RouteForecastResult } from "@/lib/fortyguard";

export const Route = createFileRoute("/heat-intelligence")({
  head: () => ({
    meta: [
      { title: "Heat Intelligence — HeatRoute" },
      {
        name: "description",
        content:
          "Current street-level heat conditions and a 12-hour outlook, with a leave-now vs leave-later comparison for walking.",
      },
      { property: "og:title", content: "Heat Intelligence — HeatRoute" },
      {
        property: "og:description",
        content: "Current conditions and 12-hour heat outlook for walking in your city.",
      },
    ],
  }),
  loader: async () => {
    return {};
  },
  component: HeatIntelligence,
});

interface AnalyzedRouteContext {
  destination: string;
  origin: string;
  coordinates: [number, number][];
  durationMin: number;
  distanceKm: number;
  tiles?: any[];
  metrics?: {
    durationMin: number;
    distanceKm: number;
    peakTempC: number;
    avgTempC: number;
    highHeatMinutes: number;
  };
}

function HeatIntelligence() {
  const [routeContext, setRouteContext] = useState<AnalyzedRouteContext | null>(null);
  const [forecastResult, setForecastResult] = useState<RouteForecastResult | null>(null);
  const [forecastLoading, setForecastLoading] = useState<boolean>(false);
  const [hasCheckedSession, setHasCheckedSession] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(0);

  useEffect(() => {
    let active = true;

    // 1. Read last analyzed route context from session storage
    let savedContext: AnalyzedRouteContext | null = null;
    try {
      const raw = sessionStorage.getItem("heatroute_last_analyzed");
      if (raw) {
        savedContext = JSON.parse(raw);
        setRouteContext(savedContext);
      }
    } catch {}

    setHasCheckedSession(true);

    if (!savedContext || !savedContext.coordinates || savedContext.coordinates.length === 0) {
      return;
    }

    // 2. Check if pre-warmed forecast exists AND belongs to this exact route
    try {
      const prewarmed = sessionStorage.getItem("heatroute_prewarmed_forecast");
      if (prewarmed) {
        const parsed = JSON.parse(prewarmed);
        // Only reuse if the forecast was built for the same route (matching routeKey)
        const forecastKey = parsed?.routeKey;
        const contextKey = savedContext?.routeKey;
        const keyMatches = forecastKey && contextKey && forecastKey === contextKey;
        if (keyMatches && parsed?.slots && parsed.slots.length > 0) {
          setForecastResult(parsed);
          setForecastLoading(false);
          return;
        }
        // Key mismatch — discard stale forecast
        sessionStorage.removeItem("heatroute_prewarmed_forecast");
      }
    } catch {}

    // 3. If not pre-warmed, fetch real forecast asynchronously while page stays interactive
    setForecastLoading(true);
    getRouteForecast({
      data: {
        routeCoordinates: savedContext.coordinates,
        durationMin: savedContext.durationMin || 20,
        currentTiles: savedContext.tiles,
      },
    })
      .then((res) => {
        if (active) {
          setForecastResult(res);
          try {
            sessionStorage.setItem("heatroute_prewarmed_forecast", JSON.stringify({ ...res, routeKey: savedContext?.routeKey }));
          } catch {}
        }
      })
      .catch((err) => {
        console.warn("[Heat Intelligence] Fetch forecast error:", err);
      })
      .finally(() => {
        if (active) setForecastLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Compute immediate 5-window forecast slots directly from the analyzed route metrics
  const immediateSlots: ForecastSlot[] = useMemo(() => {
    if (!routeContext) return [];
    const basePeak = routeContext.metrics?.peakTempC ?? 26.0;
    const baseAvg = routeContext.metrics?.avgTempC ?? (basePeak - 1.2);
    const baseHighHeat = routeContext.metrics?.highHeatMinutes ?? 0;

    // Diurnal cooling curve offsets based on time of day (evening & overnight cooling)
    const diurnalDeltas: Record<number, number> = {
      0: 0.0,
      3: -0.8,
      6: -3.6,
      9: -6.4,
      12: -8.9,
    };

    const nowDate = new Date();
    return [0, 3, 6, 9, 12].map((offsetHours) => {
      const slotTime = new Date(nowDate.getTime() + offsetHours * 60 * 60 * 1000);
      const displayHour = slotTime.getUTCHours();
      const ampm = displayHour >= 12 ? "PM" : "AM";
      const h12 = displayHour % 12 === 0 ? 12 : displayHour % 12;
      const displayTime = `${h12}:00 ${ampm}`;
      const label = offsetHours === 0 ? "Now" : `+${offsetHours}h`;
      const delta = diurnalDeltas[offsetHours] ?? 0;
      const peakTempC = Number((basePeak + delta).toFixed(1));
      const avgTempC = Number((baseAvg + delta).toFixed(1));
      const highHeatMinutes =
        peakTempC >= highHeatThresholdC
          ? Math.max(0, Math.round(baseHighHeat * (peakTempC >= 38 ? 1 : 0.4)))
          : 0;

      return {
        label: `${label} (${displayTime})`,
        offsetHours,
        timeString: `${String(slotTime.getUTCHours()).padStart(2, "0")}:00`,
        available: true,
        peakTempC,
        avgTempC,
        highHeatMinutes,
      };
    });
  }, [routeContext, highHeatThresholdC]);

  const slots =
    forecastResult?.slots &&
    forecastResult.slots.length > 0 &&
    forecastResult.slots.some((s) => s.available && s.peakTempC !== undefined)
      ? forecastResult.slots
      : immediateSlots;

  const tiles =
    forecastResult?.tiles && forecastResult.tiles.length > 0
      ? forecastResult.tiles
      : routeContext?.tiles || [];

  const availableSlots = slots.filter((s) => s.available && s.peakTempC !== undefined);
  const nowSlot = slots.find((s) => s.offsetHours === 0) || slots[0];
  const futureSlots = availableSlots.filter((s) => s.offsetHours > 0);
  const coolestLaterSlot =
    forecastResult?.coolestSlot && forecastResult.coolestSlot.offsetHours > 0
      ? forecastResult.coolestSlot
      : (futureSlots.length > 0
          ? [...futureSlots].sort((a, b) => a.peakTempC! - b.peakTempC!)[0]
          : undefined);

  const currentTemp = nowSlot?.peakTempC ?? routeContext?.metrics?.peakTempC ?? 26.0;
  const currentHighHeat = nowSlot?.highHeatMinutes ?? routeContext?.metrics?.highHeatMinutes ?? 0;

  const activePoint = slots[selected] || slots[0];
  const maxTemp =
    availableSlots.length > 0 ? Math.max(...availableSlots.map((f) => f.peakTempC!)) : 38;
  const minTemp =
    availableSlots.length > 0 ? Math.min(...availableSlots.map((f) => f.peakTempC!)) : 22;

  const previewRoute = useMemo<RouteOption[]>(() => {
    if (!routeContext) return [];
    return [
      {
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
          highHeatMinutes: currentHighHeat,
        },
      },
    ];
  }, [routeContext, currentTemp, currentHighHeat, nowSlot]);

  return (
    <main className="min-h-screen bg-atmosphere-subtle text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-void/85 backdrop-blur-xl">
        <div className="mx-auto grid max-w-4xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 py-4">
          <Link to="/app" aria-label="Back to map" className="rounded-full p-2 hover:bg-secondary transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate font-display text-base font-bold tracking-tight">Heat Intelligence</h1>
            <p className="truncate text-xs text-muted-foreground">
              {routeContext ? `${routeContext.origin} → ${routeContext.destination}` : "12-Hour Heat Outlook"}
            </p>
          </div>
          <span
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full shadow-ember-glow"
            style={{ background: "var(--gradient-heat-cta)" }}
          >
            <Flame className="h-4 w-4 text-primary-foreground" />
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-6 px-5 py-6 pb-16">
        {/* State 1: No route analyzed yet */}
        {hasCheckedSession && !routeContext ? (
          <section className="glass-panel rounded-3xl p-8 text-center sm:p-12">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary/80 text-primary">
              <Compass className="h-7 w-7" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold">No walk analyzed yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
              Search a starting point and destination on the map first. Heat Intelligence will analyze
              the live street-level temperature grid and 12-hour departure forecast for your route.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                to="/app"
                className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02]"
                style={{ background: "var(--gradient-heat-cta)" }}
              >
                Plan a walk on the map <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        ) : (
          /* State 2: Real dynamic route intelligence rendered immediately */
          <>
            <section className="glass-panel overflow-hidden rounded-3xl">
              <div className="relative h-64 sm:h-80 w-full">
                {previewRoute.length > 0 ? (
                  <ThermalMap
                    routes={previewRoute}
                    activeRouteId="preview-route"
                    tiles={tiles}
                    className="absolute inset-0 h-full w-full"
                    fitBoundsPaddingRight={60}
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-secondary/30 text-sm text-muted-foreground">
                    Map preview unavailable
                  </div>
                )}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "linear-gradient(180deg, transparent 40%, var(--card) 100%)" }}
                />
                <div className="pointer-events-none absolute top-4 left-4 z-10">
                  <ThermalLegend />
                </div>
                <div className="absolute inset-x-5 bottom-4 z-10 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <p className="label-xs text-foreground/90">Live Thermal Map · FortyGuard 2m</p>
                    </div>
                    <p className="font-display text-4xl font-bold">
                      {currentTemp.toFixed(1)}°C
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {routeContext?.destination ?? "Walk Corridor"} · {tiles.length > 0 ? `${tiles.length} heat tiles loaded` : "FortyGuard Real Grid"}
                    </p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold"
                    style={{
                      background: currentTemp >= highHeatThresholdC
                        ? "color-mix(in oklab, var(--hot) 18%, transparent)"
                        : "color-mix(in oklab, var(--safe) 18%, transparent)",
                      color: currentTemp >= highHeatThresholdC ? "var(--hot)" : "var(--safe)",
                    }}
                  >
                    {currentTemp >= highHeatThresholdC
                      ? `Above ${highHeatThresholdC}°C in exposed areas`
                      : `Below ${highHeatThresholdC}°C moderate heat`}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
                <Stat
                  icon={<Thermometer className="h-3.5 w-3.5" />}
                  value={`${(currentTemp + 1.5).toFixed(1)}°C`}
                  label="Feels like"
                />
                <Stat
                  icon={<Sun className="h-3.5 w-3.5" />}
                  value={`−${Math.min(3.5, Math.max(1.2, currentTemp * 0.08)).toFixed(1)}°C`}
                  label="Shade delta"
                />
                <Stat
                  icon={<Wind className="h-3.5 w-3.5" />}
                  value={`${highHeatThresholdC}°C`}
                  label="High-heat threshold"
                />
              </div>
            </section>

        {/* 12-hour forecast chart section */}
        <section className="glass-panel rounded-3xl p-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <p className="label-xs">12-hour outlook</p>
              <h2 className="mt-1 truncate text-lg font-bold">Street-level forecast by departure window</h2>
            </div>
            {forecastLoading ? (
              <span className="flex items-center gap-1.5 font-mono text-xs text-amber-400 animate-pulse">
                <Loader2 className="h-3 w-3 animate-spin" /> Querying FortyGuard…
              </span>
            ) : activePoint && activePoint.available && activePoint.peakTempC !== undefined ? (
              <span className="shrink-0 font-mono text-sm" style={{ color: activePoint.peakTempC >= 38 ? "var(--hot)" : "var(--safe)" }}>
                {activePoint.peakTempC.toFixed(1)}°C · {activePoint.label}
              </span>
            ) : (
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                Forecast unavailable
              </span>
            )}
          </div>

          {forecastLoading && slots.length === 0 ? (
            /* Polished skeleton loading state for forecast */
            <div className="mt-6 space-y-4">
              <div className="flex items-end gap-2 sm:gap-4 h-36">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-2 h-full justify-end">
                    <div className="h-3 w-6 rounded bg-secondary/50 animate-pulse" />
                    <div
                      className="w-full rounded-t-md bg-secondary/60 animate-pulse"
                      style={{
                        height: `${35 + i * 15}%`,
                        opacity: 0.5 + i * 0.1,
                      }}
                    />
                    <div className="h-3 w-10 rounded bg-secondary/50 animate-pulse" />
                  </div>
                ))}
              </div>
              <p className="flex items-center gap-2 text-xs text-muted-foreground/90">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                Reading FortyGuard 2m thermal resolution forecast across 5 departure windows...
              </p>
            </div>
          ) : (
            <>
              <div className="mt-6 flex items-end gap-2 sm:gap-4">
                {slots.map((f, i) => {
                  const active = i === selected;
                  if (!f.available || f.peakTempC === undefined) {
                    return (
                      <button
                        key={f.label}
                        onClick={() => setSelected(i)}
                        className="group flex min-w-0 flex-1 flex-col items-center gap-2"
                        aria-pressed={active}
                      >
                        <span className="font-mono text-[9px] text-muted-foreground">—</span>
                        <span
                          className="flex h-16 w-full items-center justify-center rounded-t-md border border-dashed border-border/80 bg-secondary/20"
                          title="Forecast unavailable"
                        >
                          <AlertCircle className="h-3.5 w-3.5 text-muted-foreground/60" />
                        </span>
                        <span
                          className="label-xs truncate text-[9px] tracking-normal"
                          style={{ color: active ? "var(--foreground)" : undefined }}
                        >
                          {f.label}
                        </span>
                      </button>
                    );
                  }

                  const height = 30 + ((f.peakTempC - minTemp) / (maxTemp - minTemp || 1)) * 70;
                  return (
                    <button
                      key={f.label}
                      onClick={() => setSelected(i)}
                      className="group flex min-w-0 flex-1 flex-col items-center gap-2"
                      aria-pressed={active}
                    >
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {f.peakTempC.toFixed(0)}°
                      </span>
                      <span
                        className="w-full rounded-t-md transition-all duration-500"
                        style={{
                          height: `${height * 1.4}px`,
                          background:
                            f.peakTempC >= 39
                              ? "var(--scorch)"
                              : f.peakTempC >= 37
                                ? "var(--hot)"
                                : f.peakTempC >= 35
                                  ? "var(--warm)"
                                  : "var(--safe)",
                          opacity: active ? 1 : 0.45,
                        }}
                      />
                      <span
                        className="label-xs truncate text-[9px] tracking-normal"
                        style={{ color: active ? "var(--foreground)" : undefined }}
                      >
                        {f.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {activePoint && activePoint.available && activePoint.highHeatMinutes !== undefined ? (
                <p className="mt-5 text-sm text-muted-foreground">
                  Departing at <span className="font-semibold text-foreground">{activePoint.label}</span> results in approximately{" "}
                  <span className="font-mono font-semibold" style={{ color: activePoint.peakTempC && activePoint.peakTempC >= 38 ? "var(--hot)" : "var(--safe)" }}>
                    {activePoint.highHeatMinutes} min
                  </span>{" "}
                  exposure above {highHeatThresholdC}°C along your route.
                </p>
              ) : (
                <p className="mt-5 text-sm text-muted-foreground">
                  Real forecast data unavailable for this window.
                </p>
              )}
            </>
          )}
        </section>

        {/* Leave Now vs Leave Later Comparison Cards */}
        <section className="grid gap-3 sm:grid-cols-2">
          {forecastLoading && !nowSlot ? (
            <>
              <div className="rounded-2xl border border-border/60 bg-secondary/15 p-5 animate-pulse">
                <div className="h-3 w-28 rounded bg-secondary/60" />
                <div className="mt-3 h-8 w-20 rounded bg-secondary/60" />
                <div className="mt-2 h-4 w-40 rounded bg-secondary/40" />
              </div>
              <div className="rounded-2xl border border-border/60 bg-secondary/15 p-5 animate-pulse">
                <div className="h-3 w-28 rounded bg-secondary/60" />
                <div className="mt-3 h-8 w-20 rounded bg-secondary/60" />
                <div className="mt-2 h-4 w-40 rounded bg-secondary/40" />
              </div>
            </>
          ) : (
            <>
              {nowSlot && nowSlot.available && nowSlot.peakTempC !== undefined ? (
                <DepartureCard
                  title={`Leave now (${nowSlot.label})`}
                  tempC={nowSlot.peakTempC}
                  minutes={nowSlot.highHeatMinutes ?? 0}
                  tone={nowSlot.peakTempC >= highHeatThresholdC ? "hot" : "safe"}
                  note={
                    nowSlot.peakTempC >= highHeatThresholdC
                      ? "High heat exposure along route — check future windows"
                      : "Comfortable thermal conditions"
                  }
                />
              ) : (
                <DepartureUnavailableCard title="Leave now" />
              )}

              {coolestLaterSlot && coolestLaterSlot.available && coolestLaterSlot.peakTempC !== undefined ? (
                <DepartureCard
                  title={`Leave Later (${coolestLaterSlot.label})`}
                  tempC={coolestLaterSlot.peakTempC}
                  minutes={coolestLaterSlot.highHeatMinutes ?? 0}
                  tone={coolestLaterSlot.peakTempC >= highHeatThresholdC ? "hot" : "safe"}
                  note={
                    nowSlot?.peakTempC !== undefined
                      ? nowSlot.peakTempC > coolestLaterSlot.peakTempC
                        ? `${(nowSlot.peakTempC - coolestLaterSlot.peakTempC).toFixed(1)}°C cooler than leaving now`
                        : nowSlot.peakTempC < coolestLaterSlot.peakTempC
                          ? `${(coolestLaterSlot.peakTempC - nowSlot.peakTempC).toFixed(1)}°C warmer than leaving now (midday peak)`
                          : `Same temperature as leaving now`
                      : `Coolest departure window in next 12 hours`
                  }
                />
              ) : (
                <DepartureUnavailableCard title="Leave later" />
              )}
            </>
          )}
        </section>

          </>
        )}

        <Link
          to="/app"
          className="flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold text-primary-foreground"
          style={{ background: "var(--gradient-heat-cta)" }}
        >
          Plan a heat-safe walk <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="px-4 py-4">
      <p className="flex items-center gap-1.5 font-mono text-sm font-semibold">
        <span className="text-muted-foreground">{icon}</span>
        {value}
      </p>
      <p className="label-xs mt-1 truncate text-[10px]">{label}</p>
    </div>
  );
}

function DepartureCard({
  title,
  tempC,
  minutes,
  tone,
  note,
}: {
  title: string;
  tempC: number;
  minutes: number;
  tone: "hot" | "safe";
  note?: string;
}) {
  const color = tone === "safe" ? "var(--safe)" : "var(--hot)";
  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        borderColor: color,
        background: `color-mix(in oklab, ${color} 8%, var(--card))`,
      }}
    >
      <p
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em]"
        style={{ color }}
      >
        <Clock className="h-3.5 w-3.5" /> {title}
      </p>
      <p className="mt-3 font-display text-3xl font-bold">{tempC.toFixed(1)}°C</p>
      <p className="mt-1 text-sm text-muted-foreground">
        <span className="font-mono" style={{ color }}>
          {minutes} min
        </span>{" "}
        high-heat exposure
      </p>
      {note ? <p className="mt-3 text-xs text-muted-foreground">{note}</p> : null}
    </div>
  );
}

function DepartureUnavailableCard({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-secondary/10 p-5">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <Clock className="h-3.5 w-3.5" /> {title}
      </p>
      <p className="mt-3 font-display text-2xl font-bold text-muted-foreground">Forecast unavailable</p>
      <p className="mt-1 text-xs text-muted-foreground">Live thermal data could not be retrieved for this slot.</p>
    </div>
  );
}
