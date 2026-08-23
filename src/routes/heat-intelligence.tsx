import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ArrowLeft, ArrowRight, Clock, Flame, Sun, Thermometer, Wind, AlertCircle, Layers } from "lucide-react";
import { ThermalMap, ThermalLegend } from "@/components/heatroute/ThermalMap";
import {
  currentConditions,
  highHeatThresholdC,
  fastestGeometryCoords,
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
    try {
      const forecastData = await getRouteForecast({
        data: {
          routeCoordinates: fastestGeometryCoords,
          durationMin: 20,
        },
      });
      return { forecastData };
    } catch (err) {
      console.warn("Forecast loader error:", err);
      return { forecastData: null };
    }
  },
  component: HeatIntelligence,
});

function HeatIntelligence() {
  const loaderData = Route.useLoaderData();
  const forecastResult: RouteForecastResult | null = loaderData?.forecastData;

  const slots = forecastResult?.slots || [];
  const tiles = forecastResult?.tiles || [];
  const [selected, setSelected] = useState(0);

  const availableSlots = slots.filter((s) => s.available && s.peakTempC !== undefined);
  const nowSlot = slots.find((s) => s.offsetHours === 0) || slots[0];
  const coolestSlot = forecastResult?.coolestSlot || (availableSlots.length > 0
    ? [...availableSlots].sort((a, b) => (a.peakTempC! - b.peakTempC!))[0]
    : undefined);

  const currentTemp = nowSlot?.peakTempC ?? currentConditions.tempC;
  const currentHighHeat = nowSlot?.highHeatMinutes ?? 11;

  const activePoint = slots[selected] || slots[0];
  const maxTemp = availableSlots.length > 0 ? Math.max(...availableSlots.map((f) => f.peakTempC!)) : 40;
  const minTemp = availableSlots.length > 0 ? Math.min(...availableSlots.map((f) => f.peakTempC!)) : 34;

  const previewRoute = useMemo<RouteOption[]>(() => [
    {
      id: "preview-route",
      kind: "heat-safe",
      label: "Central Phoenix Walking Corridor",
      geometry: fastestGeometryCoords,
      recommended: true,
      metrics: {
        durationMin: 20,
        distanceKm: 1.4,
        peakTempC: currentTemp,
        avgTempC: nowSlot?.avgTempC ?? currentTemp,
        highHeatMinutes: currentHighHeat,
      },
    },
  ], [currentTemp, currentHighHeat, nowSlot]);

  return (
    <main className="min-h-screen bg-atmosphere-subtle text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-void/85 backdrop-blur-xl">
        <div className="mx-auto grid max-w-4xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 py-4">
          <Link to="/app" aria-label="Back to map" className="rounded-full p-2 hover:bg-secondary transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate font-display text-base font-bold tracking-tight">Heat Intelligence</h1>
            <p className="truncate text-xs text-muted-foreground">{currentConditions.city}</p>
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
        <section className="glass-panel overflow-hidden rounded-3xl">
          <div className="relative h-64 sm:h-80 w-full">
            <ThermalMap
              routes={previewRoute}
              activeRouteId="preview-route"
              tiles={tiles}
              className="absolute inset-0 h-full w-full"
              fitBoundsPaddingRight={60}
            />
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
                  Phoenix Central Corridor · {tiles.length > 0 ? `${tiles.length} heat tiles loaded` : "FortyGuard Real Grid"}
                </p>
              </div>
              <span
                className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold"
                style={{
                  background: "color-mix(in oklab, var(--hot) 18%, transparent)",
                  color: "var(--hot)",
                }}
              >
                Above {highHeatThresholdC}°C in exposed areas
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
            <Stat
              icon={<Thermometer className="h-3.5 w-3.5" />}
              value={`${(currentTemp + 2.5).toFixed(1)}°C`}
              label="Feels like"
            />
            <Stat
              icon={<Sun className="h-3.5 w-3.5" />}
              value={`−${currentConditions.shadeDeltaC.toFixed(1)}°C`}
              label="Shade delta"
            />
            <Stat
              icon={<Wind className="h-3.5 w-3.5" />}
              value={`${highHeatThresholdC}°C`}
              label="High-heat threshold"
            />
          </div>
        </section>

        {/* 12-hour forecast chart */}
        <section className="glass-panel rounded-3xl p-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <p className="label-xs">12-hour outlook</p>
              <h2 className="mt-1 truncate text-lg font-bold">Street-level forecast by departure window</h2>
            </div>
            {activePoint && activePoint.available && activePoint.peakTempC !== undefined ? (
              <span className="shrink-0 font-mono text-sm" style={{ color: activePoint.peakTempC >= 38 ? "var(--hot)" : "var(--safe)" }}>
                {activePoint.peakTempC.toFixed(1)}°C · {activePoint.label}
              </span>
            ) : (
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                Forecast unavailable
              </span>
            )}
          </div>

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
        </section>

        {/* Leave Now vs Leave Later Comparison Cards */}
        <section className="grid gap-3 sm:grid-cols-2">
          {nowSlot && nowSlot.available && nowSlot.peakTempC !== undefined ? (
            <DepartureCard
              title="Leave now (Peak Afternoon)"
              tempC={nowSlot.peakTempC}
              minutes={nowSlot.highHeatMinutes ?? 20}
              tone={nowSlot.peakTempC >= 38 ? "hot" : "safe"}
              note="Midday peak heat exposure"
            />
          ) : (
            <DepartureUnavailableCard title="Leave now" />
          )}

          {coolestSlot && coolestSlot.available && coolestSlot.peakTempC !== undefined ? (
            <DepartureCard
              title={`Leave Later (${coolestSlot.label})`}
              tempC={coolestSlot.peakTempC}
              minutes={coolestSlot.highHeatMinutes ?? 0}
              tone="safe"
              note={
                nowSlot?.peakTempC
                  ? `${(nowSlot.peakTempC - coolestSlot.peakTempC).toFixed(1)}°C cooler than leaving now`
                  : `Coolest window in next 12 hours`
              }
            />
          ) : (
            <DepartureUnavailableCard title="Leave later" />
          )}
        </section>

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
