import { type RouteOption } from "./heatroute-data";

export interface TemperatureTile {
  id: string;
  averageTempC: number;
  minTempC: number;
  maxTempC: number;
  // Bounding box [minLon, minLat, maxLon, maxLat] or polygon coordinates
  polygon: [number, number][]; // [[lon, lat], ...]
  bbox: [number, number, number, number];
}

export interface FortyGuardHeatmapResult {
  source: "FortyGuard Live" | "cache" | "fallback";
  tilesCount: number;
  stats?: {
    min: number;
    max: number;
    mean: number;
  };
  tiles: TemperatureTile[];
}

export interface RouteThermalMetrics {
  peakTempC: number;
  avgTempC: number;
  highHeatMinutes: number;
  sampledPointsCount: number;
}

export interface ForecastSlot {
  label: string;
  offsetHours: number;
  timeString: string; // e.g. "14:00", "17:00", "20:00", "23:00", "02:00"
  available: boolean;
  peakTempC?: number;
  avgTempC?: number;
  highHeatMinutes?: number;
  statusNotice?: string;
}

export interface RouteForecastResult {
  source: "FortyGuard Forecast Live" | "cache" | "partial";
  slots: ForecastSlot[];
  coolestSlot?: ForecastSlot;
  hottestSlot?: ForecastSlot;
  tiles?: TemperatureTile[];
}

export interface CoolerRerouteResult {
  route: RouteOption;
  tiles: TemperatureTile[];
  timeSlotLabel: string;
  slotKey: string;
  cacheSource: "slot-cache" | "general-cache" | "cold-fallback" | "dynamic-grid" | "unavailable";
  tileCount: number;
  available: boolean;
  hasCoolerOption: boolean;
  message?: string;
  statusNotice?: string;
}

// Default high heat threshold in Celsius
export const HIGH_HEAT_THRESHOLD_C = 38.0;

/**
 * Ray-casting algorithm for Point in Polygon check
 * pt: [lon, lat], polygon: [[lon, lat], ...]
 */
export function isPointInPolygon(pt: [number, number], polygon: [number, number][]): boolean {
  const [x, y] = pt;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]!;
    const [xj, yj] = polygon[j]!;
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Pure calculation function to sample points along a route geometry, locate intersecting
 * temperature tiles, and calculate peakTempC, avgTempC, and highHeatMinutes.
 * Fully client-safe (no Node.js or network dependencies).
 */
export function calculateRouteThermalMetrics(
  routeCoordinates: [number, number][],
  durationMin: number,
  tiles: TemperatureTile[],
  defaultBaselineTempC = 38.2,
  samplePointsCount = 20,
  thresholdC = HIGH_HEAT_THRESHOLD_C,
): RouteThermalMetrics {
  if (!routeCoordinates || routeCoordinates.length === 0) {
    return {
      peakTempC: defaultBaselineTempC,
      avgTempC: defaultBaselineTempC,
      highHeatMinutes: 0,
      sampledPointsCount: 0,
    };
  }

  // Sample evenly along the coordinate vertices
  const sampledPoints: [number, number][] = [];
  const totalCoords = routeCoordinates.length;

  if (totalCoords <= samplePointsCount) {
    sampledPoints.push(...routeCoordinates);
  } else {
    for (let i = 0; i < samplePointsCount; i++) {
      const idx = Math.min(Math.floor((i / (samplePointsCount - 1)) * (totalCoords - 1)), totalCoords - 1);
      sampledPoints.push(routeCoordinates[idx]!);
    }
  }

  const sampledTemps: number[] = [];

  sampledPoints.forEach((pt) => {
    let matchedTile: TemperatureTile | undefined;

    // Fast bounding box pre-check + point in polygon
    for (const tile of tiles) {
      const [minX, minY, maxX, maxY] = tile.bbox;
      if (pt[0] >= minX && pt[0] <= maxX && pt[1] >= minY && pt[1] <= maxY) {
        if (isPointInPolygon(pt, tile.polygon)) {
          matchedTile = tile;
          break;
        }
      }
    }

    if (matchedTile) {
      sampledTemps.push(matchedTile.averageTempC);
    } else if (tiles.length > 0) {
      // Proximity fallback to nearest tile if slightly outside grid boundary
      let closestTile = tiles[0]!;
      let minDist = Infinity;
      for (const t of tiles) {
        const d = Math.hypot(pt[0] - t.polygon[0]![0], pt[1] - t.polygon[0]![1]);
        if (d < minDist) {
          minDist = d;
          closestTile = t;
        }
      }
      sampledTemps.push(closestTile.averageTempC);
    } else {
      sampledTemps.push(defaultBaselineTempC);
    }
  });

  const peakTempC = Number(Math.max(...sampledTemps).toFixed(1));
  const avgTempC = Number((sampledTemps.reduce((acc, v) => acc + v, 0) / sampledTemps.length).toFixed(1));

  // Count proportion of sampled walk spent in tiles >= threshold
  const highHeatPoints = sampledTemps.filter((t) => t >= thresholdC).length;
  const highHeatMinutes = Math.round((highHeatPoints / sampledTemps.length) * durationMin);

  return {
    peakTempC,
    avgTempC,
    highHeatMinutes,
    sampledPointsCount: sampledTemps.length,
  };
}
