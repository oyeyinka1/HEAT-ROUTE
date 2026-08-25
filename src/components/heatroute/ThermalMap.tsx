// ThermalMap is a thin re-export of InteractiveMap.
// InteractiveMap has zero top-level Leaflet imports — it loads leaflet lazily
// inside useEffect (client-only). This static import is SSR-safe.
import { InteractiveMap } from "./InteractiveMap";
import { type RouteOption } from "@/lib/heatroute-data";
import { type TemperatureTile } from "@/lib/fortyguard-types";

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

export default ThermalMap;
