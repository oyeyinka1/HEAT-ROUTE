import { InteractiveMap } from "./InteractiveMap";
import { type RouteOption } from "@/lib/heatroute-data";
import { type TemperatureTile } from "@/lib/fortyguard";

export interface ThermalMapProps {
  routes?: RouteOption[];
  activeRouteId?: string | null | undefined;
  onSelectRoute?: ((id: string) => void) | undefined;
  /** Changing this key replays the route-drawing animation. */
  drawKey?: string | number | undefined;
  /** Progress marker (0-1) along the active route, for navigation view. */
  progress?: number | undefined;
  dim?: boolean | undefined;
  tiles?: TemperatureTile[] | undefined;
  className?: string | undefined;
  fitBoundsPaddingRight?: number | undefined;
}

export function ThermalMap(props: ThermalMapProps) {
  return <InteractiveMap {...props} />;
}

export function ThermalLegend({ className = "" }: { className?: string }) {
  return (
    <div className={`glass-panel flex items-center gap-3 rounded-full px-4 py-2 ${className}`}>
      <span className="label-xs">Cooler</span>
      <span className="thermal-bar h-1.5 w-24 rounded-full sm:w-36" />
      <span className="label-xs">Hotter</span>
    </div>
  );
}
