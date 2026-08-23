import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Clock,
  Flame,
  Footprints,
  Layers,
  Loader2,
  LocateFixed,
  MapPin,
  Navigation,
  Search,
  Sparkles,
  Thermometer,
  TriangleAlert,
  X,
} from "lucide-react";
import { RouteCard } from "@/components/heatroute/RouteCard";
import { ThermalLegend, ThermalMap } from "@/components/heatroute/ThermalMap";
import {
  analysisStages,
  navSteps,
  routeAccent,
  routeAnalysis,
  type NavStep,
  type RouteOption,
} from "@/lib/heatroute-data";
import { getWalkingRoutes } from "@/lib/directions";
import { searchPlaces, type GeocodeSuggestion } from "@/lib/geocoding";
import {
  getTemperatureHeatmap,
  calculateRouteThermalMetrics,
  getCoolerRerouteData,
  type FortyGuardHeatmapResult,
  type TemperatureTile,
} from "@/lib/fortyguard";
import {
  selectRecommendedRoute,
  applyRecommendation,
  type SelectionResult,
} from "@/lib/route-selection";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "HeatRoute — Heat-aware walking navigation" },
      {
        name: "description",
        content:
          "Enter a destination and compare walking routes by high-heat exposure, peak temperature and travel time before you start navigating.",
      },
      { property: "og:title", content: "HeatRoute — Heat-aware walking navigation" },
      {
        property: "og:description",
        content:
          "Compare fastest and heat-safe walking routes using street-level temperature intelligence.",
      },
    ],
  }),
  loader: async () => {
    // No pre-fetch on page load — routing and heatmap are computed on demand
    // when the user submits an origin + destination search.
    return {
      directions: null,
      heatmap: null,
    };
  },
  component: HeatRouteApp,
});

type Phase = "search" | "analyzing" | "routes" | "navigating" | "arrived";

// Phoenix bounding box used ONLY to gate the hardcoded fail-safe in directions.ts.
// Not used as a default for origin/destination coordinates in the UI.
const PHOENIX_FALLBACK_BBOX = {
  lonCenter: -112.074,
  latCenter: 33.4484,
  radiusDeg: 0.15,
} as const;

/** Returns true if a [lon, lat] coordinate is within the Phoenix Downtown corridor */
function isNearPhoenixCorridor(coord: [number, number]): boolean {
  return (
    Math.abs(coord[0] - PHOENIX_FALLBACK_BBOX.lonCenter) < PHOENIX_FALLBACK_BBOX.radiusDeg &&
    Math.abs(coord[1] - PHOENIX_FALLBACK_BBOX.latCenter) < PHOENIX_FALLBACK_BBOX.radiusDeg
  );
}

function HeatRouteApp() {
  const loaderData = Route.useLoaderData();
  const [phase, setPhase] = useState<Phase>("search");
  const [destination, setDestination] = useState("");
  const [destinationCoord, setDestinationCoord] = useState<[number, number] | null>(null);
  const [originQuery, setOriginQuery] = useState("");
  const [originCoord, setOriginCoord] = useState<[number, number] | null>(null);
  const [originLabel, setOriginLabel] = useState<string>("Detecting location…");
  const [gpsCoord, setGpsCoord] = useState<[number, number] | null>(null);
  const [hasUserGeo, setHasUserGeo] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState(0);
  const [thermalSource, setThermalSource] = useState<string | null>(loaderData?.heatmap?.source ?? null);
  const [thermalTiles, setThermalTiles] = useState<TemperatureTile[]>(loaderData?.heatmap?.tiles || []);
  const [routeError, setRouteError] = useState<string | null>(null);

  const [routes, setRoutes] = useState<RouteOption[]>(() => {
    const directionsRoutes = loaderData?.directions?.routes;
    const tiles = loaderData?.heatmap?.tiles || [];

    if (directionsRoutes && directionsRoutes.length > 0) {
      const scored = routeAnalysis.routes.map((r, i) => {
        const fetched = directionsRoutes[i] ?? directionsRoutes[0]!;
        const durationMin = fetched.durationSeconds
          ? Math.round(fetched.durationSeconds / 60)
          : r.metrics.durationMin;
        const distanceKm = fetched.distanceMeters
          ? Number((fetched.distanceMeters / 1000).toFixed(1))
          : r.metrics.distanceKm;

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
            highHeatMinutes: thermal.highHeatMinutes,
          },
        };
      });
      // Stage 5: apply real selection logic — replaces hardcoded recommended flags
      return applyRecommendation(scored);
    }
    // No pre-loaded data — start with empty routes; populated on first search
    return [];
  });

  const [selectedId, setSelectedId] = useState<string>("r-heat-safe");
  const [whyOpen, setWhyOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rerouteState, setRerouteState] = useState<"idle" | "offered" | "accepted" | "declined">(
    "idle",
  );
  // Cooler alternative starts as a copy of the first route (populated after first real search)
  const [coolerRouteOption, setCoolerRouteOption] = useState<RouteOption>(() => {
    const base = routeAnalysis.routes[0];
    return base
      ? { ...base, id: "r-cooler", label: "Cooler Alternative" }
      : { ...routeAnalysis.routes[0]!, id: "r-cooler", label: "Cooler Alternative" };
  });
  const [coolerSlotLabel, setCoolerSlotLabel] = useState<string>("+6h (8:00 PM)");
  const [isTriggeringReroute, setIsTriggeringReroute] = useState(false);
  const [routingSource, setRoutingSource] = useState<string | null>(loaderData?.directions?.source ?? null);

  // Request browser geolocation on mount, fallback cleanly to null (no silent Phoenix assumption)
  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLon = position.coords.longitude;
          const userLat = position.coords.latitude;
          setOriginCoord([userLon, userLat]);
          setGpsCoord([userLon, userLat]);
          setOriginLabel("Current GPS location");
          setOriginQuery("Current GPS location");
          setHasUserGeo(true);
          console.info("[Geolocation] User location resolved:", [userLon, userLat]);
        },
        (error) => {
          console.info("[Geolocation] Permission denied or unavailable:", error.message);
          setOriginCoord(null);
          setGpsCoord(null);
          setOriginLabel("Enter start location");
          setOriginQuery("");
          setHasUserGeo(false);
        },
        { timeout: 8000, maximumAge: 60000 },
      );
    } else {
      setOriginLabel("Enter start location");
      setOriginQuery("");
    }
  }, []);

  useEffect(() => {
    if (loaderData?.directions?.source) {
      setRoutingSource(loaderData.directions.source);
    }
    if (loaderData?.heatmap?.source) {
      setThermalSource(loaderData.heatmap.source);
    }
  }, [loaderData]);

  const selected = useMemo(
    () => routes.find((r) => r.id === selectedId) ?? routes[0],
    [routes, selectedId],
  );

  // Stage 5: derive the live selection result whenever routes (and their metrics) change.
  // This keeps the "Why this route?" explanation honest and up-to-date.
  const selectionResult = useMemo<SelectionResult | null>(() => {
    try {
      return routes.length > 0 ? selectRecommendedRoute(routes) : null;
    } catch {
      return null;
    }
  }, [routes]);

  // Analysis sequence + fetch walking routes and FortyGuard heatmap for selected endpoints
  useEffect(() => {
    if (phase !== "analyzing") return;
    // Guard: both coordinates must be set before we can request a route
    if (!originCoord || !destinationCoord) {
      console.warn("[Analysis] Cannot compute route: origin or destination coordinate is null");
      setRouteError("Please set both a start location and a destination before analysing.");
      setPhase("routes"); // Show error panel
      return;
    }
    setStage(0);

    let cancelled = false;
    let currentStage = 0;
    // Advance visual stages smoothly while computing
    const stageInterval = setInterval(() => {
      if (currentStage < analysisStages.length - 1) {
        currentStage += 1;
        setStage(currentStage);
      }
    }, 600);

    async function computeRoutesWithHeatmap() {
      try {
        setRouteError(null);
        const dirRes = await getWalkingRoutes({ data: { start: originCoord!, end: destinationCoord! } });
        if (cancelled) return;
        if (dirRes.source) setRoutingSource(dirRes.source);

        if (dirRes.error || !dirRes.routes || dirRes.routes.length === 0) {
          console.info("[Analysis] No walking routes returned:", dirRes.error);
          setRoutes([]);
          setThermalTiles([]);
          setRouteError(dirRes.error || "No walking route found — destination is too far to walk.");
          return;
        }

        const coordsList = dirRes.routes?.map((r) => r.coordinates) || [];
        let currentTiles = thermalTiles;

        if (coordsList.length > 0) {
          try {
            const heatRes = await getTemperatureHeatmap({ data: { routesCoordinates: coordsList } });
            if (cancelled) return;
            if (heatRes.source) setThermalSource(heatRes.source);
            if (heatRes.tiles && heatRes.tiles.length > 0) {
              currentTiles = heatRes.tiles;
              setThermalTiles(heatRes.tiles);
            }
          } catch (err) {
            console.warn("[Analysis] Heatmap retrieval fallback:", err);
          }
        }

        if (dirRes.routes && dirRes.routes.length > 0) {
          setRoutes((prev) => {
            const baseList = prev.length > 0 ? prev : routeAnalysis.routes;
            const scored = baseList.map((r, i) => {
              const fetched = dirRes.routes[i] ?? dirRes.routes[0]!;
              const durationMin = fetched.durationSeconds
                ? Math.round(fetched.durationSeconds / 60)
                : r.metrics.durationMin;
              const distanceKm = fetched.distanceMeters
                ? Number((fetched.distanceMeters / 1000).toFixed(1))
                : r.metrics.distanceKm;

              const thermal = calculateRouteThermalMetrics(fetched.coordinates, durationMin, currentTiles);

              return {
                ...r,
                geometry: fetched.coordinates,
                steps: fetched.steps ?? r.steps,
                metrics: {
                  ...r.metrics,
                  durationMin,
                  distanceKm,
                  peakTempC: thermal.peakTempC,
                  avgTempC: thermal.avgTempC,
                  highHeatMinutes: thermal.highHeatMinutes,
                },
              };
            });
            // Stage 5: re-run selection after every metric refresh
            return applyRecommendation(scored);
          });
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
  }, [phase, originCoord, destinationCoord]);

  // Step progression is manual (user taps Next) — no timer here.

  function handleSelectOrigin(placeName: string, coords: [number, number]) {
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

  function handleSelectDestination(placeName: string, coords: [number, number]) {
    setDestination(placeName);
    setQuery(placeName);
    setDestinationCoord(coords);
  }

  async function handleAnalyze() {
    let currentStart = originCoord;
    let currentEnd = destinationCoord;

    // Geocode start if user typed text but didn't click dropdown
    if (!currentStart && originQuery.trim()) {
      try {
        const geo = await searchPlaces({ data: { text: originQuery.trim() } });
        if (geo.suggestions && geo.suggestions.length > 0) {
          currentStart = geo.suggestions[0]!.coordinates;
          setOriginCoord(currentStart);
          setOriginLabel(geo.suggestions[0]!.name || originQuery.trim());
        }
      } catch (err) {
        console.warn("[Search] Start geocode fallback:", err);
      }
    }

    // Geocode destination if user typed text but didn't click dropdown
    if (!currentEnd && query.trim()) {
      try {
        const geo = await searchPlaces({ data: { text: query.trim(), focusPoint: currentStart ?? undefined } });
        if (geo.suggestions && geo.suggestions.length > 0) {
          currentEnd = geo.suggestions[0]!.coordinates;
          setDestinationCoord(currentEnd);
          setDestination(geo.suggestions[0]!.name || query.trim());
        }
      } catch (err) {
        console.warn("[Search] Destination geocode fallback:", err);
      }
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
    try {
      const activeRoute = selected ?? routes[0]!;
      const activeCoords = activeRoute?.geometry || fastestGeometryCoords;

      // ── BEFORE: log the active route's current real metrics ──────────────────
      console.info(
        "[Demo Reroute] BEFORE — Current route metrics:",
        `id=${activeRoute?.id},`,
        `peak=${activeRoute?.metrics.peakTempC?.toFixed(1)}°C,`,
        `avg=${activeRoute?.metrics.avgTempC?.toFixed(1)}°C,`,
        `highHeatMin=${activeRoute?.metrics.highHeatMinutes}min,`,
        `durationMin=${activeRoute?.metrics.durationMin}min`,
      );

      const rerouteData = await getCoolerRerouteData({
        data: {
          routeCoordinates: activeCoords,
          durationMin: Math.max(15, (activeRoute?.metrics.durationMin ?? 20) + 1),
        },
      });

      // ── AFTER: log the cooler slot's real metrics and provenance ─────────────
      console.info(
        "[Demo Reroute] AFTER — Cooler route metrics:",
        `slot=${rerouteData.slotKey} (${rerouteData.timeSlotLabel}),`,
        `source=${rerouteData.cacheSource},`,
        `tileCount=${rerouteData.tileCount},`,
        `peak=${rerouteData.route.metrics.peakTempC.toFixed(1)}°C,`,
        `avg=${rerouteData.route.metrics.avgTempC.toFixed(1)}°C,`,
        `highHeatMin=${rerouteData.route.metrics.highHeatMinutes}min,`,
        `durationMin=${rerouteData.route.metrics.durationMin}min`,
      );
      console.info(
        `[Demo Reroute] ΔPeak: ${(activeRoute?.metrics.peakTempC ?? 0) - rerouteData.route.metrics.peakTempC >= 0 ? "-" : "+"}${Math.abs((activeRoute?.metrics.peakTempC ?? 0) - rerouteData.route.metrics.peakTempC).toFixed(1)}°C |`,
        `ΔHighHeat: ${(activeRoute?.metrics.highHeatMinutes ?? 0) - rerouteData.route.metrics.highHeatMinutes >= 0 ? "-" : "+"}${Math.abs((activeRoute?.metrics.highHeatMinutes ?? 0) - rerouteData.route.metrics.highHeatMinutes)}min`,
      );

      // Build cooler option: keep ALL identity/nav data from the real active route
      // (geometry, steps, label, distanceKm) — only swap the temperature metrics
      // from the FortyGuard +6h slot. Nothing about the destination or directions changes.
      const coolerOption: RouteOption = {
        ...activeRoute,
        id: "r-cooler",
        metrics: {
          ...activeRoute.metrics,
          // Only these three fields come from the evening forecast slot:
          peakTempC: rerouteData.route.metrics.peakTempC,
          avgTempC: rerouteData.route.metrics.avgTempC,
          highHeatMinutes: rerouteData.route.metrics.highHeatMinutes,
          // Duration is the same route — we keep the real durationMin from activeRoute
          // (getCoolerRerouteData adds 1 min for the "+1 min" display, but we own that here)
        },
      };

      setCoolerRouteOption(coolerOption);
      setCoolerSlotLabel(rerouteData.timeSlotLabel);
      if (rerouteData.tiles && rerouteData.tiles.length > 0) {
        setThermalTiles(rerouteData.tiles);
      }
      setRerouteState("offered");
    } catch (err) {
      console.warn("[Demo Reroute] Using fallback cooler option:", err);
      setRerouteState("offered");
    } finally {
      setIsTriggeringReroute(false);
    }
  }

  function acceptReroute() {
    setRoutes([routes[0]!, coolerRouteOption]);
    setSelectedId(coolerRouteOption.id);
    setRerouteState("accepted");
  }

  const mapRoutes = (phase === "navigating" || phase === "arrived")
    ? (selected ? [selected] : [])
    : routes;
  const progress = phase === "navigating"
    ? Math.min(0.95, stepIndex / Math.max(1, (selected?.steps?.length ?? navSteps.length) - 1))
    : phase === "arrived"
      ? 1.0
      : undefined;

  // Check whether the active route's geometry is within the Phoenix corridor.
  // The Simulate Conditions feature uses cached Phoenix FortyGuard slot data —
  // it is only meaningful when the user is navigating a Phoenix route.
  const isPhoenixRoute = selected
    ? isNearPhoenixCorridor(selected.geometry[0] ?? [-999, -999])
    : false;

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-background">
      <ThermalMap
        routes={mapRoutes}
        activeRouteId={selected?.id}
        onSelectRoute={phase === "routes" ? setSelectedId : undefined}
        drawKey={`${phase}-${routes.map((r) => r.id).join("-")}`}
        {...(progress !== undefined ? { progress } : {})}
        dim={phase === "analyzing"}
      />

      <TopBar
        temp={routeAnalysis.currentTempC}
        routingSource={routingSource}
        thermalSource={thermalSource}
      />

      <ThermalLegend className="absolute bottom-[calc(var(--sheet-h,58dvh)+0.75rem)] left-4 z-20 hidden md:bottom-6 md:flex" />

      {/* Desktop: floating search panel, left */}
      {phase !== "navigating" ? (
        <div className="pointer-events-none absolute left-6 top-24 z-20 hidden w-[350px] md:block">
          <div className="pointer-events-auto animate-rise-in">
            <SearchPanel
              originQuery={originQuery}
              setOriginQuery={setOriginQuery}
              onSelectOrigin={handleSelectOrigin}
              onUseGpsOrigin={gpsCoord ? handleUseGpsOrigin : undefined}
              destinationQuery={query}
              setDestinationQuery={setQuery}
              onSelectDestination={handleSelectDestination}
              onAnalyze={handleAnalyze}
              originLabel={originLabel}
              destination={destination}
              hasUserGeo={hasUserGeo}
              gpsAvailable={Boolean(gpsCoord)}
              originCoord={originCoord ?? undefined}
              phase={phase}
            />
          </div>
        </div>
      ) : null}

      {/* Panel: right rail on desktop, bottom sheet on mobile */}
      <section className="absolute inset-x-0 bottom-0 z-30 md:inset-y-0 md:left-auto md:right-0 md:w-[420px] md:p-6">
        <div
          key={phase}
          className="glass-panel animate-sheet-up max-h-[80dvh] overflow-y-auto rounded-t-3xl px-4 pb-6 pt-3 md:h-full md:max-h-full md:rounded-3xl md:p-6"
        >
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border md:hidden" />

          {phase === "search" ? (
            <MobileSearch
              originQuery={originQuery}
              setOriginQuery={setOriginQuery}
              onSelectOrigin={handleSelectOrigin}
              onUseGpsOrigin={gpsCoord ? handleUseGpsOrigin : undefined}
              destinationQuery={query}
              setDestinationQuery={setQuery}
              onSelectDestination={handleSelectDestination}
              onAnalyze={handleAnalyze}
              originLabel={originLabel}
              hasUserGeo={hasUserGeo}
              gpsAvailable={Boolean(gpsCoord)}
              originCoord={originCoord ?? undefined}
            />
          ) : null}

          {phase === "analyzing" ? (
            <AnalyzingPanel stage={stage} destination={destination} />
          ) : null}

          {phase === "routes" ? (
            <RoutesPanel
              routes={routes}
              selectedId={selectedId}
              onSelect={setSelectedId}
              destination={destination}
              whyOpen={whyOpen}
              setWhyOpen={setWhyOpen}
              selectionResult={selectionResult}
              routeError={routeError}
              onStart={() => {
                setPhase("navigating");
                setStepIndex(0);
                setRerouteState("idle");
              }}
              onBack={() => {
                setPhase("search");
                setRouteError(null);
              }}
            />
          ) : null}

          {phase === "navigating" && selected ? (
            <NavigationPanel
              route={selected}
              stepIndex={stepIndex}
              rerouteState={rerouteState}
              coolerRouteOption={coolerRouteOption}
              coolerSlotLabel={coolerSlotLabel}
              isTriggeringReroute={isTriggeringReroute}
              isPhoenixRoute={isPhoenixRoute}
              onTriggerReroute={triggerSimulatedConditionChange}
              onAccept={acceptReroute}
              onDecline={() => setRerouteState("declined")}
              onNext={() => setStepIndex((i) => i + 1)}
              onArrive={() => setPhase("arrived")}
              onExit={() => {
                setPhase("routes");
                setRerouteState("idle");
              }}
            />
          ) : null}

          {phase === "arrived" && selected ? (
            <ArrivedPanel
              destination={destination}
              route={selected}
              onDone={() => {
                setPhase("search");
                setStepIndex(0);
                setRerouteState("idle");
              }}
            />
          ) : null}
        </div>
      </section>
    </main>
  );
}

function TopBar({
  temp,
  routingSource,
  thermalSource,
}: {
  temp: number;
  routingSource?: string | null | undefined;
  thermalSource?: string | null | undefined;
}) {
  return (
    <header className="absolute inset-x-0 top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4 md:p-6 md:pr-[452px]">
      <Link to="/" className="flex min-w-0 items-center gap-2.5">
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full shadow-ember-glow"
          style={{ background: "var(--gradient-heat-cta)" }}
        >
          <Flame className="h-4 w-4 text-primary-foreground" />
        </span>
        <span className="truncate font-display text-base font-bold tracking-tight">HeatRoute</span>
      </Link>
      <div className="flex shrink-0 items-center gap-2">
        {routingSource ? (
          <span
            className="glass-panel hidden items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] text-muted-foreground sm:flex"
            title="Routing Engine Tier"
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background:
                  routingSource === "OpenRouteService"
                    ? "var(--safe)"
                    : routingSource === "OSM fallback"
                      ? "var(--balanced)"
                      : "var(--hot)",
              }}
            />
            Routing: {routingSource}
          </span>
        ) : null}

        {thermalSource ? (
          <span
            className="glass-panel hidden items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] text-muted-foreground sm:flex"
            title="Temperature Grid Tier"
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background:
                  thermalSource === "FortyGuard Live"
                    ? "var(--safe)"
                    : thermalSource === "cache"
                      ? "var(--balanced)"
                      : "var(--hot)",
              }}
            />
            Thermal: {thermalSource}
          </span>
        ) : null}

        <div className="glass-panel flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold">
          <Thermometer className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono">{temp}°C</span>
        </div>
        <Link
          to="/heat-intelligence"
          className="glass-panel hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors hover:text-primary hover:border-border/80 sm:flex"
        >
          <Layers className="h-3.5 w-3.5" /> Heat Intelligence
        </Link>
      </div>
    </header>
  );
}

function SearchPanel({
  originQuery,
  setOriginQuery,
  onSelectOrigin,
  onUseGpsOrigin,
  destinationQuery,
  setDestinationQuery,
  onSelectDestination,
  onAnalyze,
  originLabel,
  destination,
  hasUserGeo,
  gpsAvailable,
  originCoord,
  phase,
}: {
  originQuery: string;
  setOriginQuery: (v: string) => void;
  onSelectOrigin: (name: string, coords: [number, number]) => void;
  onUseGpsOrigin?: () => void;
  destinationQuery: string;
  setDestinationQuery: (v: string) => void;
  onSelectDestination: (name: string, coords: [number, number]) => void;
  onAnalyze: () => void;
  originLabel: string;
  destination: string;
  hasUserGeo: boolean;
  gpsAvailable: boolean;
  originCoord?: [number, number];
  phase: Phase;
}) {
  return (
    <div className="glass-panel rounded-2xl p-4">
      <p className="label-xs mb-3">{phase === "search" ? "Plan a walk" : "Trip Summary"}</p>
      {phase === "search" ? (
        <DualSearchFields
          originQuery={originQuery}
          setOriginQuery={setOriginQuery}
          onSelectOrigin={onSelectOrigin}
          onUseGpsOrigin={onUseGpsOrigin}
          destinationQuery={destinationQuery}
          setDestinationQuery={setDestinationQuery}
          onSelectDestination={onSelectDestination}
          onAnalyze={onAnalyze}
          originLabel={originLabel}
          hasUserGeo={hasUserGeo}
          gpsAvailable={gpsAvailable}
          originCoord={originCoord}
        />
      ) : (
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
            <span className="truncate text-muted-foreground">{originLabel || "Start location"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--scorch)" }} />
            <span className="truncate font-medium text-foreground">{destination || "Destination"}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileSearch({
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
  originCoord,
}: {
  originQuery: string;
  setOriginQuery: (v: string) => void;
  onSelectOrigin: (name: string, coords: [number, number]) => void;
  onUseGpsOrigin?: () => void;
  destinationQuery: string;
  setDestinationQuery: (v: string) => void;
  onSelectDestination: (name: string, coords: [number, number]) => void;
  onAnalyze: () => void;
  originLabel: string;
  hasUserGeo: boolean;
  gpsAvailable: boolean;
  originCoord?: [number, number];
}) {
  return (
    <div className="md:hidden">
      <h1 className="mb-1 text-xl font-bold">Plan your walk</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Compare walking routes by street-level heat anywhere in the US.
      </p>
      <DualSearchFields
        originQuery={originQuery}
        setOriginQuery={setOriginQuery}
        onSelectOrigin={onSelectOrigin}
        onUseGpsOrigin={onUseGpsOrigin}
        destinationQuery={destinationQuery}
        setDestinationQuery={setDestinationQuery}
        onSelectDestination={onSelectDestination}
        onAnalyze={onAnalyze}
        originLabel={originLabel}
        hasUserGeo={hasUserGeo}
        gpsAvailable={gpsAvailable}
        originCoord={originCoord}
      />
    </div>
  );
}

function DualSearchFields({
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
  originCoord,
}: {
  originQuery: string;
  setOriginQuery: (v: string) => void;
  onSelectOrigin: (name: string, coords: [number, number]) => void;
  onUseGpsOrigin?: () => void;
  destinationQuery: string;
  setDestinationQuery: (v: string) => void;
  onSelectDestination: (name: string, coords: [number, number]) => void;
  onAnalyze: () => void;
  originLabel: string;
  hasUserGeo: boolean;
  gpsAvailable: boolean;
  originCoord?: [number, number];
}) {
  const [originSuggestions, setOriginSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [originLoading, setOriginLoading] = useState(false);
  const [destLoading, setDestLoading] = useState(false);
  const [originSource, setOriginSource] = useState<"OpenRouteService" | "fallback">("OpenRouteService");
  const [destSource, setDestSource] = useState<"OpenRouteService" | "fallback">("OpenRouteService");

  const originTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const destTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced origin search
  useEffect(() => {
    const trimmed = originQuery.trim();
    if (!trimmed || trimmed === "Current GPS location" || trimmed.length < 2) {
      setOriginSuggestions([]);
      setOriginLoading(false);
      return;
    }
    if (originTimer.current) clearTimeout(originTimer.current);
    setOriginLoading(true);
    originTimer.current = setTimeout(() => {
      searchPlaces({ data: { text: trimmed } })
        .then((res) => {
          setOriginSuggestions(res.suggestions || []);
          setOriginSource(res.source);
        })
        .catch(() => {
          setOriginSuggestions([]);
          setOriginSource("fallback");
        })
        .finally(() => setOriginLoading(false));
    }, 300);
    return () => {
      if (originTimer.current) clearTimeout(originTimer.current);
    };
  }, [originQuery]);

  // Debounced destination search
  useEffect(() => {
    const trimmed = destinationQuery.trim();
    if (!trimmed || trimmed.length < 2) {
      setDestSuggestions([]);
      setDestLoading(false);
      return;
    }
    if (destTimer.current) clearTimeout(destTimer.current);
    setDestLoading(true);
    destTimer.current = setTimeout(() => {
      searchPlaces({ data: { text: trimmed, focusPoint: originCoord } })
        .then((res) => {
          setDestSuggestions(res.suggestions || []);
          setDestSource(res.source);
        })
        .catch(() => {
          setDestSuggestions([]);
          setDestSource("fallback");
        })
        .finally(() => setDestLoading(false));
    }, 300);
    return () => {
      if (destTimer.current) clearTimeout(destTimer.current);
    };
  }, [destinationQuery, originCoord]);

  return (
    <div className="space-y-3">
      {/* ── 1. Origin input ── */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-muted-foreground">Starting point</label>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 py-2.5">
          {originLoading ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
          ) : (
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: hasUserGeo ? "var(--safe)" : "var(--cool)" }}
            />
          )}
          <input
            value={originQuery}
            onChange={(e) => setOriginQuery(e.target.value)}
            placeholder="Starting location (or use GPS)"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {originQuery && (
            <button
              type="button"
              onClick={() => {
                setOriginQuery("");
                setOriginSuggestions([]);
              }}
              aria-label="Clear start location"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          {gpsAvailable && !hasUserGeo && onUseGpsOrigin && (
            <button
              type="button"
              onClick={onUseGpsOrigin}
              title="Use GPS current location"
              className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-[10px] font-mono text-emerald-400 hover:bg-secondary/80"
            >
              <LocateFixed className="h-3 w-3" /> GPS
            </button>
          )}
        </div>

        {/* Origin Dropdown Suggestions */}
        {originSuggestions.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-border/80 bg-popover shadow-lg animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/50 bg-secondary/30 px-3 py-1 text-[10px] font-medium text-muted-foreground">
              <span>Start locations</span>
              <span className="font-mono text-emerald-400">OpenRouteService</span>
            </div>
            <div className="max-h-40 overflow-y-auto p-1">
              {originSuggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    onSelectOrigin(s.name, s.coordinates);
                    setOriginSuggestions([]);
                  }}
                  className="flex w-full items-start gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-secondary/80"
                >
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-semibold text-foreground">{s.name}</div>
                    <div className="truncate text-[10px] text-muted-foreground">{s.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── 2. Destination input ── */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-muted-foreground">Destination</label>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 py-2.5">
          {destLoading ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
          ) : (
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <input
            value={destinationQuery}
            onChange={(e) => setDestinationQuery(e.target.value)}
            placeholder="Where are you going?"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {destinationQuery && (
            <button
              type="button"
              onClick={() => {
                setDestinationQuery("");
                setDestSuggestions([]);
              }}
              aria-label="Clear destination"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Destination Dropdown Suggestions */}
        {destSuggestions.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-border/80 bg-popover shadow-lg animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/50 bg-secondary/30 px-3 py-1 text-[10px] font-medium text-muted-foreground">
              <span>Suggested destinations</span>
              <span className="font-mono text-emerald-400">OpenRouteService</span>
            </div>
            <div className="max-h-40 overflow-y-auto p-1">
              {destSuggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    onSelectDestination(s.name, s.coordinates);
                    setDestSuggestions([]);
                  }}
                  className="flex w-full items-start gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-secondary/80"
                >
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-semibold text-foreground">{s.name}</div>
                    <div className="truncate text-[10px] text-muted-foreground">{s.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <Footprints className="h-3.5 w-3.5 text-muted-foreground" /> Walking Mode
        </span>
        {hasUserGeo && (
          <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400">
            <LocateFixed className="h-3 w-3" /> GPS Connected
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onAnalyze}
        disabled={!destinationQuery.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
        style={{ background: "var(--gradient-heat-cta)" }}
      >
        Analyse heat on this walk <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function AnalyzingPanel({ stage, destination }: { stage: number; destination: string }) {
  return (
    <div className="py-2">
      <div className="flex items-center justify-between">
        <p className="label-xs">Analysing</p>
        <span className="flex items-center gap-1 font-mono text-[10px] text-amber-400">
          <Loader2 className="h-3 w-3 animate-spin" /> Live API Query
        </span>
      </div>
      <h2 className="mt-1 truncate text-lg font-bold">{destination}</h2>
      <div className="mt-5 space-y-3">
        {analysisStages.map((label, i) => {
          const done = stage > i;
          const activeStage = stage === i;
          return (
            <div key={label} className="flex items-center gap-3 text-sm">
              <span
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors duration-500"
                style={{
                  borderColor: done ? "var(--safe)" : activeStage ? "var(--amber-warning, #f59e0b)" : "var(--border)",
                  background: done
                    ? "color-mix(in oklab, var(--safe) 22%, transparent)"
                    : activeStage
                      ? "color-mix(in oklab, var(--amber-warning, #f59e0b) 15%, transparent)"
                      : "transparent",
                }}
              >
                {done ? (
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: "var(--safe)" }}
                  />
                ) : activeStage ? (
                  <Loader2 className="h-2.5 w-2.5 animate-spin" style={{ color: "var(--amber-warning, #f59e0b)" }} />
                ) : null}
              </span>
              <span
                className="min-w-0 flex-1 truncate transition-colors duration-500"
                style={{
                  color: done ? "var(--foreground)" : activeStage ? "var(--foreground)" : "var(--muted-foreground)",
                  fontWeight: activeStage ? 600 : 400,
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-6 h-1 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(100, Math.max(15, (stage / analysisStages.length) * 100))}%`,
            background: "var(--gradient-heat-cta)",
          }}
        />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Querying OpenRouteService paths & FortyGuard thermal raster data...
      </p>
    </div>
  );
}

function RoutesPanel({
  routes,
  selectedId,
  onSelect,
  destination,
  whyOpen,
  setWhyOpen,
  selectionResult,
  routeError,
  onStart,
  onBack,
}: {
  routes: RouteOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  destination: string;
  whyOpen: boolean;
  setWhyOpen: (v: boolean) => void;
  selectionResult: SelectionResult | null;
  routeError?: string | null;
  onStart: () => void;
  onBack: () => void;
}) {
  if (routes.length === 0 || routeError) {
    return (
      <div className="py-2">
        <div className="flex items-center justify-between">
          <p className="label-xs">No Route Available</p>
          <button
            onClick={onBack}
            aria-label="Back to search"
            className="rounded-full p-2 hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>
        <h2 className="mt-1 truncate text-lg font-bold">{destination}</h2>

        <div className="mt-5 rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-center">
          <span
            className="mx-auto grid h-12 w-12 place-items-center rounded-full"
            style={{ background: "color-mix(in oklab, var(--hot) 20%, transparent)" }}
          >
            <TriangleAlert className="h-6 w-6" style={{ color: "var(--hot)" }} />
          </span>
          <h3 className="mt-3 text-base font-bold text-foreground">
            No walking route found
          </h3>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            {routeError || "Destination is too far to walk from your current origin. Please try a closer destination in the same metro area."}
          </p>

          <button
            type="button"
            onClick={onBack}
            className="mt-5 w-full rounded-xl border border-border bg-secondary/80 px-4 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors"
          >
            Try a closer destination
          </button>
        </div>
      </div>
    );
  }

  const { rationale, highHeatThresholdC } = routeAnalysis;
  const selected = routes.find((r) => r.id === selectedId);

  // Use live tradeoff numbers from selectionResult when available, fall back to static
  const liveExtraTravel = selectionResult?.tradeoff.extraTravelMin ?? rationale.tradeoff.extraTravelMin;
  const liveHeatSaved = selectionResult?.tradeoff.heatMinutesSaved ?? rationale.tradeoff.heatMinutesSaved;

  // Recommended route from Stage 5 selection
  const recommendedRoute = selectionResult
    ? routes.find((r) => r.id === selectionResult.recommendedId)
    : routes.find((r) => r.recommended);

  // Show tradeoff chips when there is a recommended route that is not the fastest
  const fastestRoute = routes.find((r) => r.kind === "fastest");
  const showTradeoff =
    recommendedRoute &&
    fastestRoute &&
    recommendedRoute.id !== fastestRoute.id;

  return (
    <div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <p className="label-xs">Choose your route</p>
          <h2 className="mt-1 truncate text-lg font-bold">{destination}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Ranked by lowest time above {highHeatThresholdC}°C
          </p>
        </div>
        <button
          onClick={onBack}
          aria-label="Back to search"
          className="rounded-full p-2 hover:bg-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Stage 5: Prominent live notice chip for Near-Tie or Time-budget states */}
      {selectionResult?.isNearTie && (
        <div
          className="mt-3 flex items-start gap-2.5 rounded-xl border p-2.5 text-xs leading-relaxed animate-in fade-in-50"
          style={{
            background: "color-mix(in oklab, var(--amber-warning, #f59e0b) 14%, transparent)",
            borderColor: "color-mix(in oklab, var(--amber-warning, #f59e0b) 40%, transparent)",
            color: "var(--foreground)",
          }}
        >
          <span
            className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] font-bold"
            style={{ background: "var(--amber-warning, #f59e0b)", color: "#18181b" }}
          >
            ≈
          </span>
          <div>
            <span className="font-semibold" style={{ color: "var(--amber-warning, #f59e0b)" }}>
              Near-Tie Condition:{" "}
            </span>
            <span>
              Both routes have effectively identical heat exposure (&le;1 min difference). Recommendation is based on marginal score.
            </span>
          </div>
        </div>
      )}

      {selectionResult?.usedTimeBudgetFallback && (
        <div
          className="mt-3 flex items-start gap-2.5 rounded-xl border p-2.5 text-xs leading-relaxed animate-in fade-in-50"
          style={{
            background: "color-mix(in oklab, var(--hot) 12%, transparent)",
            borderColor: "color-mix(in oklab, var(--hot) 30%, transparent)",
            color: "var(--foreground)",
          }}
        >
          <span
            className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] font-bold"
            style={{ background: "var(--hot)", color: "var(--background)" }}
          >
            !
          </span>
          <div>
            <span className="font-semibold" style={{ color: "var(--hot)" }}>
              Time-Budget Limit:{" "}
            </span>
            <span>
              No meaningfully cooler route exists within +20% travel time. Fastest route selected.
            </span>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-2.5">
        {routes.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            selected={route.id === selectedId}
            onSelect={onSelect}
            isNearTie={Boolean(selectionResult?.isNearTie)}
          />
        ))}
      </div>

      {showTradeoff ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Tradeoff
            value={liveExtraTravel >= 0 ? `+${liveExtraTravel} min` : `${liveExtraTravel} min`}
            label="vs Fastest: travel time"
            color={liveExtraTravel > 0 ? "var(--hot)" : "var(--safe)"}
            up={liveExtraTravel > 0}
          />
          <Tradeoff
            value={liveHeatSaved >= 0 ? `−${liveHeatSaved} min` : `+${Math.abs(liveHeatSaved)} min`}
            label="vs Fastest: high-heat"
            color={liveHeatSaved > 0 ? "var(--safe)" : "var(--hot)"}
          />
        </div>
      ) : null}

      <div className="mt-4 overflow-hidden rounded-xl border border-border/70">
        <button
          onClick={() => setWhyOpen(!whyOpen)}
          className="flex w-full items-center justify-between gap-2 px-3 py-3 text-left text-sm font-medium hover:bg-secondary/40"
          aria-expanded={whyOpen}
        >
          <span className="flex min-w-0 items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0" style={{ color: "var(--safe)" }} />
            Why this route?
          </span>
          <ChevronRight
            className="h-4 w-4 shrink-0 transition-transform duration-300"
            style={{ transform: whyOpen ? "rotate(90deg)" : undefined }}
          />
        </button>
        {whyOpen ? (
          <dl className="animate-sheet-up space-y-3 border-t border-border/70 px-3 py-3 text-sm">
            <Fact term="Goal" detail={rationale.goal} />
            <Fact term="Routes evaluated" detail={String(routes.length)} />
            <Fact term="Temperature intelligence" detail={rationale.dataSource} />
            <Fact
              term="Selected"
              detail={selectionResult?.selectedLabel ?? rationale.selected}
            />
            {/* Stage 5: live, honest reason from selectRecommendedRoute */}
            <Fact
              term="Reason"
              detail={selectionResult?.reason ?? rationale.reason}
            />
            {selectionResult && (
              <p
                className="rounded-lg p-2.5 text-xs"
                style={{
                  background: selectionResult.usedTimeBudgetFallback
                    ? "color-mix(in oklab, var(--hot) 12%, transparent)"
                    : selectionResult.isNearTie
                      ? "color-mix(in oklab, var(--balanced) 14%, transparent)"
                      : "color-mix(in oklab, var(--safe) 12%, transparent)",
                  color: selectionResult.usedTimeBudgetFallback
                    ? "var(--hot)"
                    : selectionResult.isNearTie
                      ? "var(--balanced)"
                      : "var(--safe)",
                }}
              >
                {selectionResult.usedTimeBudgetFallback ? (
                  "No meaningfully safer route was available within the 20% time budget."
                ) : selectionResult.isNearTie ? (
                  "⚠ Near-tie detected — routes show marginal heat exposure difference (< 1 min). Differences are not meaningful."
                ) : selectionResult.tradeoff.reductionPct > 0 ? (
                  <>
                    {selectionResult.tradeoff.reductionPct}% less high-heat exposure than the fastest
                    route, for{" "}
                    {liveExtraTravel >= 0
                      ? `${liveExtraTravel} extra minute${liveExtraTravel !== 1 ? "s" : ""} of walking.`
                      : `${Math.abs(liveExtraTravel)} fewer minute${Math.abs(liveExtraTravel) !== 1 ? "s" : ""} of walking.`}
                  </>
                ) : (
                  "This route has the same or lower heat exposure as all other options."
                )}
              </p>
            )}
          </dl>
        ) : null}
      </div>

      <button
        onClick={onStart}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold"
        style={{
          background: routeAccent[selected?.kind ?? "heat-safe"],
          color: "var(--safe-foreground)",
        }}
      >
        <Navigation className="h-4 w-4" /> Start navigation
      </button>
    </div>
  );
}

function Tradeoff({
  value,
  label,
  color,
  up,
}: {
  value: string;
  label: string;
  color: string;
  up?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border/70 p-3">
      <p className="font-mono text-sm font-semibold" style={{ color }}>
        {up ? "▲" : "▼"} {value}
      </p>
      <p className="label-xs mt-1 text-[10px]">{label}</p>
    </div>
  );
}

function Fact({ term, detail }: { term: string; detail: string }) {
  return (
    <div>
      <dt className="label-xs">{term}</dt>
      <dd className="mt-1 text-sm text-foreground/90">{detail}</dd>
    </div>
  );
}

function NavigationPanel({
  route,
  stepIndex,
  rerouteState,
  coolerRouteOption,
  coolerSlotLabel,
  isTriggeringReroute,
  isPhoenixRoute = false,
  onTriggerReroute,
  onNext,
  onArrive,
  onAccept,
  onDecline,
  onExit,
}: {
  route: RouteOption;
  stepIndex: number;
  rerouteState: "idle" | "offered" | "accepted" | "declined";
  coolerRouteOption: RouteOption;
  coolerSlotLabel?: string;
  isTriggeringReroute?: boolean;
  isPhoenixRoute?: boolean;
  onTriggerReroute: () => void;
  onNext: () => void;
  onArrive: () => void;
  onAccept: () => void;
  onDecline: () => void;
  onExit: () => void;
}) {
  // Use real ORS steps stored on the route; fall back to Phoenix street defaults
  const activeSteps = route.steps && route.steps.length > 0 ? route.steps : navSteps;
  const totalSteps = activeSteps.length;
  const isLastStep = stepIndex >= totalSteps - 1;
  const step = activeSteps[Math.min(stepIndex, totalSteps - 1)]!;

  // Remaining values calculated from what fraction of steps are left — not from a timer
  const completedFraction = totalSteps > 1 ? stepIndex / (totalSteps - 1) : 0;
  const remainingFraction = 1 - completedFraction;
  const remainingMin = Math.max(1, Math.round(route.metrics.durationMin * remainingFraction));
  const remainingKm = Math.max(0.1, Number((route.metrics.distanceKm * remainingFraction).toFixed(1)));
  // Exposure bar fills as steps are completed
  const exposurePct = Math.round(completedFraction * 100);

  const heatSavedMin = Math.max(0, route.metrics.highHeatMinutes - coolerRouteOption.metrics.highHeatMinutes);
  const extraTravelMin = coolerRouteOption.metrics.durationMin - route.metrics.durationMin;

  if (rerouteState === "offered") {
    return (
      <div className="animate-sheet-up py-1">
        <div className="flex items-center gap-3">
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
            style={{ background: "rgba(255, 138, 61, 0.16)", border: "1px solid rgba(255, 138, 61, 0.3)" }}
          >
            <Sparkles className="h-5 w-5" style={{ color: "var(--ember-glow)" }} />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-bold leading-snug">Route conditions changed</h2>
            <p className="truncate text-xs text-muted-foreground">
              Cooler route window available ({coolerSlotLabel || "Evening Forecast"})
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-border/80 bg-secondary/40 p-3.5 shadow-sm">
          <div className="grid grid-cols-3 gap-2">
            <Metric label="Walk time" value={`${coolerRouteOption.metrics.durationMin} min`} />
            <Metric
              label="Peak temp"
              value={`${coolerRouteOption.metrics.peakTempC.toFixed(1)}°C`}
              color="var(--safe)"
            />
            <Metric
              label="High heat"
              value={`${coolerRouteOption.metrics.highHeatMinutes} min`}
              color="var(--safe)"
            />
          </div>
          <p className="mt-3 text-xs" style={{ color: "var(--safe)" }}>
            {heatSavedMin > 0 ? (
              <>
                Saves <span className="font-mono font-semibold">{heatSavedMin} min</span> of high-heat exposure{" "}
                {extraTravelMin > 0 ? `for ${extraTravelMin} extra min of walking.` : "with no extra walk time."}
              </>
            ) : (
              `Lower peak temperature (${coolerRouteOption.metrics.peakTempC.toFixed(1)}°C) along the path.`
            )}
          </p>
        </div>
        <div className="mt-4 grid gap-2">
          <button
            onClick={onAccept}
            className="rounded-xl px-4 py-3 text-sm font-semibold transition-transform active:scale-[0.98]"
            style={{ background: "var(--safe)", color: "var(--safe-foreground)" }}
          >
            Reroute onto cooler alternative
          </button>
          <button
            onClick={onDecline}
            className="rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-secondary/60"
          >
            Keep current route
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Current instruction */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <p className="label-xs">
            In {step.inMeters} m · Step {stepIndex + 1} of {totalSteps}
          </p>
          <h2 className="mt-1 text-xl font-bold leading-tight">{step.instruction}</h2>
          <p className="mt-1 truncate text-xs text-muted-foreground">{step.detail}</p>
        </div>
        <button
          onClick={onExit}
          aria-label="End navigation"
          className="rounded-full p-2 hover:bg-secondary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Condition simulation trigger — Phoenix demo dataset only */}
      {isPhoenixRoute ? (
        <div className="mt-3 flex items-center justify-between rounded-xl border border-dashed border-amber-500/50 bg-amber-500/10 p-2.5">
          <div className="min-w-0 flex-1 pr-2">
            <p className="text-[11px] font-semibold text-amber-400">Simulate Conditions</p>
            <p className="truncate text-[10px] text-muted-foreground">Check for cooler route windows</p>
          </div>
          <button
            type="button"
            onClick={onTriggerReroute}
            disabled={isTriggeringReroute}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-500/20 px-2.5 py-1.5 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-500/30 disabled:opacity-50"
          >
            {isTriggeringReroute ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            <span>Simulate condition change</span>
          </button>
        </div>
      ) : (
        <p className="mt-3 rounded-xl border border-border/40 bg-secondary/30 px-3 py-2.5 text-[10px] leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground/60">Condition simulation</span> is currently available for the Phoenix demo route only.
        </p>
      )}

      {rerouteState === "accepted" ? (
        <p
          className="animate-sheet-up mt-3 rounded-lg px-3 py-2 text-xs"
          style={{
            background: "color-mix(in oklab, var(--safe) 14%, transparent)",
            color: "var(--safe)",
          }}
        >
          ✓ Rerouted onto the cooler alternative ({coolerSlotLabel || "Evening slot"}).
        </p>
      ) : null}

      {rerouteState === "declined" ? (
        <p className="animate-sheet-up mt-3 rounded-lg bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
          Staying on original route. You can simulate again using the demo button above.
        </p>
      ) : null}

      {/* Live stats — recalculate from step fraction, not a timer */}
      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border/70 pt-3">
        <Metric
          label="Remaining"
          value={`${remainingMin} min`}
          icon={<Clock className="h-3.5 w-3.5" />}
        />
        <Metric label="Distance left" value={`${remainingKm} km`} />
        <Metric
          label="Current heat"
          value={`${route.metrics.avgTempC.toFixed(1)}°C`}
          color={route.metrics.avgTempC >= 36 ? "var(--hot)" : "var(--safe)"}
        />
      </div>

      {/* Exposure progress bar — fills with steps completed */}
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <span className="label-xs">Exposure on this route</span>
          <span className="font-mono text-xs" style={{ color: "var(--safe)" }}>
            {route.metrics.highHeatMinutes} min above 36°C
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${exposurePct}%`,
              background: routeAccent[route.kind],
            }}
          />
        </div>
      </div>

      {/* Scrollable Step list */}
      <div className="mt-4 max-h-[160px] overflow-y-auto border-t border-border/70 pt-3 pr-1">
        <ol className="space-y-2">
          {activeSteps.map((s, i) => (
            <li
              key={`${s.instruction}-${i}`}
              className="flex items-center gap-2 text-xs"
              style={{
                color: i === stepIndex ? "var(--foreground)" : "var(--muted-foreground)",
                opacity: i < stepIndex ? 0.4 : 1,
              }}
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: i === stepIndex ? routeAccent[route.kind] : i < stepIndex ? "var(--safe)" : "var(--border)" }}
              />
              <span className={`truncate ${i < stepIndex ? "line-through" : ""}`}>{s.instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Sticky Bottom Action Button */}
      <div className="sticky bottom-0 z-10 mt-4 border-t border-border/60 bg-background/95 pt-3 backdrop-blur-md">
        <button
          onClick={isLastStep ? onArrive : onNext}
          className="w-full rounded-xl px-4 py-3 text-sm font-semibold shadow-md transition-all active:scale-[0.98]"
          style={
            isLastStep
              ? { background: "var(--safe)", color: "var(--safe-foreground)" }
              : { background: "var(--foreground)", color: "var(--background)" }
          }
        >
          {isLastStep ? (
            <span className="flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4" />
              I've arrived
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Next step ({stepIndex + 1}/{totalSteps})
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function ArrivedPanel({
  destination,
  route,
  onDone,
}: {
  destination: string;
  route: RouteOption;
  onDone: () => void;
}) {
  return (
    <div className="animate-sheet-up flex flex-col items-center py-6 text-center">
      <span
        className="grid h-16 w-16 place-items-center rounded-full"
        style={{ background: "color-mix(in oklab, var(--safe) 20%, transparent)" }}
      >
        <MapPin className="h-8 w-8" style={{ color: "var(--safe)" }} />
      </span>

      <h2 className="mt-5 text-2xl font-bold leading-tight">You've arrived</h2>
      <p className="mt-1 max-w-[240px] truncate text-sm text-muted-foreground">{destination}</p>

      {/* Walk summary grid */}
      <div className="mt-6 grid w-full grid-cols-2 gap-3 rounded-2xl border border-border/70 p-4">
        <div className="text-center">
          <p className="font-mono text-2xl font-bold tabular-nums" style={{ color: "var(--foreground)" }}>
            {route.metrics.durationMin}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">min total walk</p>
        </div>
        <div className="text-center">
          <p
            className="font-mono text-2xl font-bold tabular-nums"
            style={{ color: route.metrics.highHeatMinutes > 0 ? "var(--hot)" : "var(--safe)" }}
          >
            {route.metrics.highHeatMinutes}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">min above 36°C</p>
        </div>
        <div className="text-center">
          <p className="font-mono text-2xl font-bold tabular-nums" style={{ color: "var(--foreground)" }}>
            {route.metrics.distanceKm.toFixed(1)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">km walked</p>
        </div>
        <div className="text-center">
          <p className="font-mono text-2xl font-bold tabular-nums" style={{ color: "var(--safe)" }}>
            {route.metrics.peakTempC.toFixed(1)}°C
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">peak temp</p>
        </div>
      </div>

      {route.metrics.highHeatMinutes === 0 ? (
        <p className="mt-4 text-sm" style={{ color: "var(--safe)" }}>
          ✓ Zero high-heat exposure on this walk.
        </p>
      ) : (
        <p className="mt-4 text-xs text-muted-foreground">
          You spent{" "}
          <span className="font-semibold" style={{ color: "var(--hot)" }}>
            {route.metrics.highHeatMinutes} min
          </span>{" "}
          in conditions above 36°C.
        </p>
      )}

      <button
        onClick={onDone}
        className="mt-6 w-full rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary/60"
      >
        Back to search
      </button>
    </div>
  );
}

function Metric({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: string;
  color?: string | undefined;
  icon?: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p
        className="flex items-center gap-1 font-mono text-sm font-semibold"
        style={{ color: color ?? "var(--foreground)" }}
      >
        {icon}
        {value}
      </p>
      <p className="label-xs mt-0.5 truncate text-[10px]">{label}</p>
    </div>
  );
}
