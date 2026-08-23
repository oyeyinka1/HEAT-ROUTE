import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export interface GeocodeSuggestion {
  id: string;
  name: string;
  label: string;
  coordinates: [number, number]; // [lon, lat]
  locality?: string;
  region?: string;
}

export interface GeocodeResult {
  source: "OpenRouteService" | "fallback";
  suggestions: GeocodeSuggestion[];
}

// Phoenix-area curated fallbacks for offline or network timeout resilience
const PHOENIX_FALLBACK_SUGGESTIONS: GeocodeSuggestion[] = [
  {
    id: "encanto-park",
    name: "Encanto Park",
    label: "Encanto Park, Phoenix, AZ, USA",
    coordinates: [-112.0796, 33.4772],
    locality: "Phoenix",
    region: "AZ",
  },
  {
    id: "phoenix-art-museum",
    name: "Phoenix Art Museum",
    label: "Phoenix Art Museum, Central Ave, Phoenix, AZ, USA",
    coordinates: [-112.0738, 33.4674],
    locality: "Phoenix",
    region: "AZ",
  },
  {
    id: "heritage-square",
    name: "Heritage Square",
    label: "Heritage Square, 7th St, Phoenix, AZ, USA",
    coordinates: [-112.0664, 33.4497],
    locality: "Phoenix",
    region: "AZ",
  },
  {
    id: "roosevelt-row",
    name: "Roosevelt Row",
    label: "Roosevelt Row Arts District, Phoenix, AZ, USA",
    coordinates: [-112.0729, 33.4589],
    locality: "Phoenix",
    region: "AZ",
  },
];

async function fetchOrsGeocode(
  apiKey: string,
  text: string,
  focusPoint?: [number, number],
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const https = await import("node:https");
    let urlPath = `/geocode/autocomplete?api_key=${encodeURIComponent(apiKey)}&text=${encodeURIComponent(
      text,
    )}&size=6`;

    if (focusPoint && isFinite(focusPoint[0]) && isFinite(focusPoint[1])) {
      urlPath += `&focus.point.lat=${focusPoint[1]}&focus.point.lon=${focusPoint[0]}`;
    }

    const req = https.request(
      {
        hostname: "api.openrouteservice.org",
        port: 443,
        path: urlPath,
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "HeatRoute-Navigator/1.0",
        },
        timeout: 6000,
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(raw));
            } catch (err) {
              reject(err);
            }
          } else {
            reject(new Error(`ORS Geocode returned ${res.statusCode}: ${raw}`));
          }
        });
      },
    );

    req.on("error", (err) => reject(err));
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("ORS Geocode request timed out"));
    });

    req.end();
  });
}

export const searchPlaces = createServerFn({ method: "POST" })
  .validator(
    z.object({
      text: z.string().min(1),
      focusPoint: z.tuple([z.number(), z.number()]).optional(), // [lon, lat]
    }),
  )
  .handler(async ({ data }): Promise<GeocodeResult> => {
    let apiKey =
      process.env.OPENROUTESERVICE_API_KEY ||
      process.env.ORS_API_KEY ||
      process.env.VITE_OPENROUTESERVICE_API_KEY;

    if (!apiKey) {
      try {
        const fs = await import("node:fs");
        const path = await import("node:path");
        const envPath = path.resolve(process.cwd(), ".env");
        if (fs.existsSync(envPath)) {
          const content = fs.readFileSync(envPath, "utf-8");
          const match = content.match(/OPENROUTESERVICE_API_KEY\s*=\s*(.+)/);
          if (match && match[1]) {
            apiKey = match[1].trim();
          }
        }
      } catch {
        // Ignored in non-Node environments
      }
    }

    if (apiKey) {
      const maxAttempts = 2;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const geojson = await fetchOrsGeocode(apiKey, data.text, data.focusPoint);
          if (geojson.features && geojson.features.length > 0) {
            const suggestions: GeocodeSuggestion[] = geojson.features.map(
              (f: any, idx: number) => ({
                id: f.properties?.id || `ors-${idx}-${f.geometry.coordinates.join(",")}`,
                name: f.properties?.name || f.properties?.label?.split(",")[0] || "Unknown Place",
                label: f.properties?.label || f.properties?.name || "Unknown Location",
                coordinates: f.geometry.coordinates as [number, number],
                locality: f.properties?.locality || f.properties?.county,
                region: f.properties?.region_a || f.properties?.region,
              }),
            );

            return {
              source: "OpenRouteService",
              suggestions,
            };
          }
        } catch (err: any) {
          console.warn(`[Geocoding Service] ORS Geocode attempt ${attempt}/${maxAttempts} failed:`, err?.message || err);
          if (attempt < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
          }
        }
      }
    }

    return {
      source: "fallback",
      suggestions: [],
    };
  });
