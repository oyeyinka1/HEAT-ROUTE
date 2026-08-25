import { useEffect, useState } from "react";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [MapComp, setMapComp] = useState<any>(null);

  useEffect(() => {
    // Only load the Leaflet interactive map on the client after browser mount
    if (typeof window !== "undefined") {
      import("./InteractiveMap").then((m) => {
        setMapComp(() => m.InteractiveMap);
      });
    }
  }, []);

  if (!MapComp) {
    return (
      <div className={props.className || "absolute inset-0 overflow-hidden bg-background/50 flex items-center justify-center"}>
        <span className="label-xs text-muted-foreground animate-pulse">Loading map...</span>
      </div>
    );
  }

  return <MapComp {...props} />;
}

export default ThermalMap;
