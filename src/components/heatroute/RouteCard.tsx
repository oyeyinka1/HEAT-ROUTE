import { Check } from "lucide-react";
import { routeAccent, type RouteOption } from "@/lib/heatroute-data";

interface RouteCardProps {
  route: RouteOption;
  selected: boolean;
  onSelect: (id: string) => void;
  isNearTie?: boolean;
}

export function RouteCard({ route, selected, onSelect, isNearTie = false }: RouteCardProps) {
  const accent = routeAccent[route.kind];
  const { metrics } = route;

  return (
    <button
      type="button"
      onClick={() => onSelect(route.id)}
      aria-pressed={selected}
      className="w-full rounded-xl border p-3 text-left transition-all duration-300 hover:border-border sm:p-4"
      style={{
        borderColor: selected ? accent : "var(--panel-border)",
        background: selected
          ? `color-mix(in oklab, ${accent} 10%, var(--card))`
          : "color-mix(in oklab, var(--card) 70%, transparent)",
        boxShadow: selected ? "var(--shadow-panel)" : undefined,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: accent }} />
          <span
            className="truncate text-xs font-semibold uppercase tracking-[0.14em]"
            style={{ color: selected ? accent : "var(--foreground)" }}
          >
            {route.label}
          </span>
        </div>
        {route.recommended ? (
          <span
            className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{
              background: isNearTie
                ? "color-mix(in oklab, var(--amber-warning, #f59e0b) 22%, transparent)"
                : "color-mix(in oklab, var(--safe) 18%, transparent)",
              color: isNearTie ? "var(--amber-warning, #f59e0b)" : "var(--safe)",
              border: isNearTie
                ? "1px solid color-mix(in oklab, var(--amber-warning, #f59e0b) 45%, transparent)"
                : undefined,
            }}
          >
            <Check className="h-3 w-3" /> {isNearTie ? "Recommended (Near-Tie)" : "Recommended"}
          </span>
        ) : null}
      </div>

      <div className="mt-3 grid grid-cols-4 gap-x-2 gap-y-3">
        <Metric value={`${metrics.durationMin} min`} label="Walk time" />
        <Metric value={`${metrics.distanceKm} km`} label="Distance" />
        <Metric
          value={`${metrics.peakTempC.toFixed(1)}°C`}
          label="Peak temp"
          color={
            metrics.peakTempC >= 38
              ? "var(--scorch)"
              : metrics.peakTempC >= 36
                ? "var(--hot)"
                : "var(--safe)"
          }
        />
        <Metric
          value={`${metrics.highHeatMinutes} min`}
          label="High heat"
          color={selected ? accent : undefined}
        />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="label-xs shrink-0 normal-case tracking-normal">
          Avg {metrics.avgTempC.toFixed(1)}°C
        </span>
        <span className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
          <span
            className="block h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(100, (metrics.highHeatMinutes / metrics.durationMin) * 100)}%`,
              background: accent,
            }}
          />
        </span>
      </div>
    </button>
  );
}

function Metric({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color?: string | undefined;
}) {
  return (
    <div className="min-w-0">
      <p
        className="font-mono text-sm font-semibold"
        style={{ color: color ?? "var(--foreground)" }}
      >
        {value}
      </p>
      <p className="label-xs mt-0.5 truncate text-[10px] tracking-[0.1em]">{label}</p>
    </div>
  );
}
