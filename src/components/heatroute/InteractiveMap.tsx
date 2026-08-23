import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Polygon, useMap } from "react-leaflet";
import L from "leaflet";
import type { RouteOption } from "@/lib/heatroute-data";
import type { TemperatureTile } from "@/lib/fortyguard";

export interface InteractiveMapProps {
  routes?: RouteOption[];
  activeRouteId?: string | null | undefined;
  onSelectRoute?: ((id: string) => void) | undefined;
  drawKey?: string | number | undefined;
  progress?: number | undefined;
  dim?: boolean | undefined;
  tiles?: TemperatureTile[] | undefined;
  className?: string | undefined;
  fitBoundsPaddingRight?: number | undefined;
}

// Default neutral US map center until routes or tiles are provided:
const DEFAULT_MAP_CENTER: [number, number] = [39.8283, -98.5795];
const DEFAULT_ZOOM = 4;

// Temperature color mapper for FortyGuard tiles
function getTileColor(tempC: number): string {
  if (tempC >= 40) return "rgb(239, 68, 68)"; // scorch red
  if (tempC >= 38) return "rgb(249, 115, 22)"; // hot orange
  if (tempC >= 36) return "rgb(234, 179, 8)"; // warm amber
  if (tempC >= 34) return "rgb(59, 130, 246)"; // mild blue
  return "rgb(34, 197, 94)"; // safe green
}

// Colors matching the design tokens
const ROUTE_COLORS: Record<string, { main: string; glow: string }> = {
  "heat-safe": {
    main: "rgb(68, 209, 137)", // oklch safe green
    glow: "rgba(68, 209, 137, 0.4)",
  },
  fastest: {
    main: "rgb(240, 240, 245)", // oklch fastest white/light
    glow: "rgba(240, 240, 245, 0.3)",
  },
  balanced: {
    main: "rgb(96, 165, 250)", // oklch balanced blue
    glow: "rgba(96, 165, 250, 0.35)",
  },
};

/** Helper to fit map bounds to visible routes or tiles */
function MapBoundsController({
  routes,
  tiles,
  paddingRight = 420,
}: {
  routes?: RouteOption[] | undefined;
  tiles?: TemperatureTile[] | undefined;
  paddingRight?: number | undefined;
}) {
  const map = useMap();

  useEffect(() => {
    const latLngs: [number, number][] = [];
    if (routes && routes.length > 0) {
      routes.forEach((r) => {
        r.geometry.forEach(([lon, lat]) => {
          latLngs.push([lat, lon]);
        });
      });
    } else if (tiles && tiles.length > 0) {
      tiles.forEach((t) => {
        t.polygon.forEach(([lon, lat]) => {
          latLngs.push([lat, lon]);
        });
      });
    }

    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, {
        paddingTopLeft: [40, 40],
        paddingBottomRight: [paddingRight, 40],
        maxZoom: 16,
      });
    }
  }, [routes, tiles, paddingRight, map]);

  return null;
}

export function InteractiveMap({
  routes,
  activeRouteId,
  onSelectRoute,
  drawKey: _drawKey,
  progress,
  dim = false,
  tiles,
  className,
  fitBoundsPaddingRight = 420,
}: InteractiveMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const active = useMemo(
    () => routes?.find((r) => r.id === activeRouteId) ?? routes?.[0],
    [routes, activeRouteId],
  );

  // Compute progress coordinate on active route if navigating
  const progressCoord = useMemo<[number, number] | null>(() => {
    if (typeof progress !== "number" || !active || !active.geometry.length) return null;
    const index = Math.min(
      Math.floor(progress * (active.geometry.length - 1)),
      active.geometry.length - 1,
    );
    const [lon, lat] = active.geometry[index]!;
    return [lat, lon];
  }, [active, progress]);

  const originCoord = useMemo<[number, number] | null>(() => {
    if (!routes?.[0]?.geometry?.[0]) return null;
    const [lon, lat] = routes[0].geometry[0];
    return [lat, lon];
  }, [routes]);

  const destCoord = useMemo<[number, number] | null>(() => {
    if (!routes?.[0]?.geometry?.length) return null;
    const [lon, lat] = routes[0].geometry[routes[0].geometry.length - 1]!;
    return [lat, lon];
  }, [routes]);

  if (!isMounted) {
    return (
      <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
        <span className="label-xs text-muted-foreground animate-pulse">Loading map...</span>
      </div>
    );
  }

  return (
    <div
      className={className || "absolute inset-0 overflow-hidden transition-opacity duration-500"}
      style={{ opacity: dim ? 0.42 : 1 }}
    >
      <MapContainer
        center={DEFAULT_MAP_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBoundsController routes={routes} tiles={tiles} paddingRight={fitBoundsPaddingRight} />

        {/* FortyGuard Heatmap Tiles */}
        {tiles?.map((tile) => {
          const positions = tile.polygon.map(([lon, lat]) => [lat, lon] as [number, number]);
          const fillColor = getTileColor(tile.averageTempC);
          return (
            <Polygon
              key={tile.id}
              positions={positions}
              pathOptions={{
                color: fillColor,
                weight: 0.8,
                opacity: 0.4,
                fillColor: fillColor,
                fillOpacity: 0.32,
              }}
            />
          );
        })}

        {/* Polylines for routes */}
        {routes?.map((route) => {
          const isActive = route.id === active?.id;
          const colors = ROUTE_COLORS[route.kind] ?? ROUTE_COLORS["heat-safe"]!;
          // Leaflet expects [latitude, longitude]
          const positions = route.geometry.map(([lon, lat]) => [lat, lon] as [number, number]);

          return (
            <span key={route.id}>
              {/* Outer glow line */}
              <Polyline
                positions={positions}
                pathOptions={{
                  color: colors.glow,
                  weight: isActive ? 14 : 9,
                  opacity: isActive ? 0.85 : 0.35,
                  lineCap: "round",
                  lineJoin: "round",
                }}
                eventHandlers={{
                  click: () => onSelectRoute?.(route.id),
                }}
              />
              {/* Core inner polyline */}
              <Polyline
                positions={positions}
                pathOptions={{
                  color: colors.main,
                  weight: isActive ? 6 : 4,
                  opacity: isActive ? 1 : 0.65,
                  lineCap: "round",
                  lineJoin: "round",
                }}
                eventHandlers={{
                  click: () => onSelectRoute?.(route.id),
                }}
              />
            </span>
          );
        })}

        {/* Origin Marker */}
        {originCoord ? (
          <>
            <CircleMarker
              center={originCoord}
              radius={12}
              pathOptions={{
                color: "rgba(96, 165, 250, 0.4)",
                fillColor: "#3b82f6",
                fillOpacity: 0.3,
                weight: 2,
              }}
            />
            <CircleMarker
              center={originCoord}
              radius={6}
              pathOptions={{
                color: "#ffffff",
                fillColor: "#3b82f6",
                fillOpacity: 1,
                weight: 2,
              }}
            />
          </>
        ) : null}

        {/* Destination Marker */}
        {destCoord ? (
          <>
            <CircleMarker
              center={destCoord}
              radius={14}
              pathOptions={{
                color: "rgba(239, 68, 68, 0.4)",
                fillColor: "#ef4444",
                fillOpacity: 0.3,
                weight: 2,
              }}
            />
            <CircleMarker
              center={destCoord}
              radius={6}
              pathOptions={{
                color: "#ffffff",
                fillColor: "#ef4444",
                fillOpacity: 1,
                weight: 2,
              }}
            />
          </>
        ) : null}

        {/* Live Progress Marker */}
        {progressCoord ? (
          <>
            <CircleMarker
              center={progressCoord}
              radius={14}
              pathOptions={{
                color: "rgba(68, 209, 137, 0.5)",
                fillColor: "rgb(68, 209, 137)",
                fillOpacity: 0.4,
                weight: 2,
              }}
            />
            <CircleMarker
              center={progressCoord}
              radius={7}
              pathOptions={{
                color: "#ffffff",
                fillColor: "rgb(68, 209, 137)",
                fillOpacity: 1,
                weight: 3,
              }}
            />
          </>
        ) : null}
      </MapContainer>
    </div>
  );
}
