/**
 * HeatRoute domain model + mock data.
 *
 * Everything the UI renders comes from these types. A real FortyGuard-backed
 * service can return the same shapes (see `getRouteAnalysis`) without any UI
 * redesign.
 */

export type RouteKind = "fastest" | "balanced" | "heat-safe";

export interface RouteMetrics {
  /** Walking duration in minutes. */
  durationMin: number;
  /** Distance in kilometres. */
  distanceKm: number;
  /** Peak street-level temperature along the route, °C. */
  peakTempC: number;
  /** Average street-level temperature along the route, °C. */
  avgTempC: number;
  /** Minutes spent above the high-heat threshold. */
  highHeatMinutes: number;
}

export interface RouteOption {
  id: string;
  kind: RouteKind;
  label: string;
  metrics: RouteMetrics;
  /** Array of [lon, lat] coordinate pairs. */
  geometry: [number, number][];
  /** Recommended route for the current conditions. */
  recommended: boolean;
  /** Real turn-by-turn steps from ORS or Phoenix street defaults. */
  steps?: NavStep[];
}

export interface RouteRationale {
  goal: string;
  routesEvaluated: number;
  dataSource: string;
  selected: string;
  reason: string;
  /** Comparison against the fastest route. */
  tradeoff: { extraTravelMin: number; heatMinutesSaved: number; reductionPct: number };
}

export interface RouteAnalysis {
  origin: string;
  destination: string;
  /** Threshold above which time is counted as high-heat exposure, °C. */
  highHeatThresholdC: number;
  currentTempC: number;
  routes: RouteOption[];
  rationale: RouteRationale;
}

export interface NavStep {
  instruction: string;
  detail: string;
  inMeters: number;
}

export interface ForecastPoint {
  label: string;
  tempC: number;
  highHeatMinutes: number;
}

// Downtown Phoenix [-112.0740, 33.4484] to Encanto Park [-112.0796, 33.4772]
export const heatSafeGeometryCoords: [number, number][] = [
  [-112.074, 33.4484],
  [-112.0765, 33.4484],
  [-112.0772, 33.4525],
  [-112.0772, 33.458],
  [-112.0773, 33.4635],
  [-112.0774, 33.4695],
  [-112.0775, 33.4745],
  [-112.0796, 33.4745],
  [-112.0796, 33.4772],
];

export const fastestGeometryCoords: [number, number][] = [
  [-112.074, 33.4484],
  [-112.074, 33.451],
  [-112.0741, 33.4552],
  [-112.0741, 33.4601],
  [-112.0742, 33.4655],
  [-112.0743, 33.471],
  [-112.0743, 33.475],
  [-112.0775, 33.4751],
  [-112.0796, 33.4751],
  [-112.0796, 33.4772],
];

export const highHeatThresholdC = 36;

export const routeAnalysis: RouteAnalysis = {
  origin: "Current location",
  destination: "Encanto Park, Phoenix",
  highHeatThresholdC,
  currentTempC: 35.2,
  routes: [
    {
      id: "r-fastest",
      kind: "fastest",
      label: "Fastest",
      geometry: fastestGeometryCoords,
      recommended: false,
      metrics: {
        durationMin: 17,
        distanceKm: 1.2,
        peakTempC: 39.4,
        avgTempC: 37.1,
        highHeatMinutes: 11,
      },
    },
    {
      id: "r-heat-safe",
      kind: "heat-safe",
      label: "Heat-Safe",
      geometry: heatSafeGeometryCoords,
      recommended: true,
      metrics: {
        durationMin: 20,
        distanceKm: 1.4,
        peakTempC: 34.8,
        avgTempC: 33.6,
        highHeatMinutes: 4,
      },
    },
  ],
  rationale: {
    goal: "Minimise time spent above the high-heat threshold",
    routesEvaluated: 2,
    dataSource: "FortyGuard street-level temperature intelligence (2 m resolution)",
    selected: "Heat-Safe route",
    reason:
      "This route keeps you on shaded, cooler street segments for most of the walk. It lowers estimated high-heat exposure the most while staying inside the acceptable travel-time penalty.",
    tradeoff: { extraTravelMin: 3, heatMinutesSaved: 7, reductionPct: 63 },
  },
};

/** The cooler alternative offered during the simulated reroute. */
export const rerouteOption: RouteOption = {
  id: "r-cooler",
  kind: "heat-safe",
  label: "Cooler alternative",
  geometry: heatSafeGeometryCoords,
  recommended: true,
  metrics: {
    durationMin: 21,
    distanceKm: 1.5,
    peakTempC: 33.4,
    avgTempC: 32.4,
    highHeatMinutes: 2,
  },
};

export const navSteps: NavStep[] = [
  { instruction: "Head north on N Central Ave", detail: "Main arterial corridor", inMeters: 400 },
  { instruction: "Turn left onto W Roosevelt St", detail: "Tree-lined pedestrian street", inMeters: 350 },
  { instruction: "Turn right onto N 3rd Ave", detail: "Canopy-shaded residential sidewalk", inMeters: 600 },
  { instruction: "Continue onto Encanto Blvd path", detail: "Park entrance greenway", inMeters: 250 },
  { instruction: "Arrive at destination", detail: "Phoenix, AZ", inMeters: 100 },
];

export const analysisStages = [
  "Reading street-level temperature grid",
  "Generating candidate walking routes",
  "Scoring high-heat exposure per segment",
  "Balancing exposure against travel time",
];

export const currentConditions = {
  city: "Phoenix, AZ",
  tempC: 35.2,
  feelsLikeC: 38.1,
  shadeDeltaC: 4.3,
  updated: "Updated 2 min ago",
};

export const forecast: ForecastPoint[] = [
  { label: "Now", tempC: 35.2, highHeatMinutes: 11 },
  { label: "1 PM", tempC: 37.4, highHeatMinutes: 14 },
  { label: "2 PM", tempC: 38.2, highHeatMinutes: 16 },
  { label: "3 PM", tempC: 37.9, highHeatMinutes: 15 },
  { label: "4 PM", tempC: 36.6, highHeatMinutes: 12 },
  { label: "5 PM", tempC: 35.1, highHeatMinutes: 9 },
  { label: "6 PM", tempC: 33.4, highHeatMinutes: 5 },
  { label: "7 PM", tempC: 31.8, highHeatMinutes: 2 },
];

export const departureComparison = {
  now: { label: "Leave now", tempC: 35.2, highHeatMinutes: 11 },
  later: { label: "Leave in 3 hours", tempC: 33.4, highHeatMinutes: 5, inHours: 3 },
};

/**
 * Single read boundary for route intelligence. Swap the body for a server
 * function call once FortyGuard-backed routing is available.
 */
export async function getRouteAnalysis(destination: string): Promise<RouteAnalysis> {
  return { ...routeAnalysis, destination };
}

export const savedPlaces = [
  "Encanto Park",
  "Phoenix Art Museum",
  "Heritage Square",
  "Roosevelt Row",
];

export const routeAccent: Record<RouteKind, string> = {
  fastest: "var(--fastest)",
  balanced: "var(--balanced)",
  "heat-safe": "var(--safe)",
};
