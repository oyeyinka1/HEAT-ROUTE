/**
 * Stage 5 — Dynamic Heat-Safe Route Selection
 *
 * Pure selection logic: takes an array of scored RouteOption values and
 * determines which one should be marked `recommended: true`, and why.
 *
 * Rules:
 *  1. Among all routes, find the one with the lowest `highHeatMinutes`.
 *  2. If that route's duration is <= 120% of the fastest route's duration
 *     (i.e. at most ~20% time penalty), recommend it.
 *  3. Otherwise recommend the fastest route instead and note that no
 *     meaningfully safer option exists within a reasonable time cost.
 *  4. Near-tie honesty: when the winning margin in `highHeatMinutes` is
 *     < 1 minute vs. the next-best route, the explanation text must say
 *     the difference is marginal rather than claim a significant win.
 */

import type { RouteOption } from "./heatroute-data";

/** The margin (in high-heat minutes) below which or equal to which we consider routes near-identical. */
const NEAR_TIE_THRESHOLD_MIN = 1.0;

/** Maximum allowed time penalty (as a fraction of fastest duration) to prefer a cooler route. */
const MAX_TIME_PENALTY_FRACTION = 0.2;

export interface SelectionResult {
  /** ID of the route that should receive `recommended: true`. */
  recommendedId: string;
  /** Human-readable explanation for the "Why this route?" panel. */
  reason: string;
  /** One-line summary of the selected route name for the `rationale.selected` field. */
  selectedLabel: string;
  /** Live tradeoff numbers derived from real metrics. */
  tradeoff: {
    extraTravelMin: number;
    heatMinutesSaved: number;
    reductionPct: number;
  };
  /** True when the heat-exposure difference vs. the next-best route is <= NEAR_TIE_THRESHOLD_MIN. */
  isNearTie: boolean;
  /** True when we fell back to the fastest route because the cooler route exceeded the time budget. */
  usedTimeBudgetFallback: boolean;
}

/**
 * Selects which route should be recommended based on real RouteMetrics.
 *
 * @param routes - Array of RouteOption values with already-calculated metrics.
 * @returns SelectionResult describing which route wins and why.
 */
export function selectRecommendedRoute(routes: RouteOption[]): SelectionResult {
  if (routes.length === 0) {
    throw new Error("[route-selection] Cannot select from an empty route array.");
  }

  if (routes.length === 1) {
    const only = routes[0]!;
    return {
      recommendedId: only.id,
      selectedLabel: only.label,
      reason: "Only one route available; it has been selected by default.",
      tradeoff: { extraTravelMin: 0, heatMinutesSaved: 0, reductionPct: 0 },
      isNearTie: false,
      usedTimeBudgetFallback: false,
    };
  }

  // --- Find reference routes ---
  const fastestRoute = [...routes].sort(
    (a, b) => a.metrics.durationMin - b.metrics.durationMin,
  )[0]!;

  const lowestHeatRoute = [...routes].sort(
    (a, b) => a.metrics.highHeatMinutes - b.metrics.highHeatMinutes,
  )[0]!;

  const maxAllowedDuration =
    fastestRoute.metrics.durationMin * (1 + MAX_TIME_PENALTY_FRACTION);

  // --- Decide whether the cooler route is within the time budget ---
  const coolerIsWithinTimeBudget =
    lowestHeatRoute.metrics.durationMin <= maxAllowedDuration;

  const winner = coolerIsWithinTimeBudget ? lowestHeatRoute : fastestRoute;
  const usedTimeBudgetFallback = !coolerIsWithinTimeBudget;

  // --- Near-tie detection ---
  // Sort by highHeatMinutes; check gap between 1st and 2nd
  const byHeat = [...routes].sort(
    (a, b) => a.metrics.highHeatMinutes - b.metrics.highHeatMinutes,
  );
  const bestHeat = byHeat[0]!.metrics.highHeatMinutes;
  const secondBestHeat = byHeat[1]?.metrics.highHeatMinutes ?? bestHeat;
  const heatDelta = Math.abs(secondBestHeat - bestHeat);
  // Include exact 1-minute differences in near-tie condition
  const isNearTie = heatDelta <= NEAR_TIE_THRESHOLD_MIN;

  console.info(
    `[RouteSelection] Evaluating ${routes.length} routes: ` +
    routes.map((r) => `${r.label}(duration:${r.metrics.durationMin}m, highHeat:${r.metrics.highHeatMinutes}m)`).join(", ") +
    ` | heatDelta: ${heatDelta}m, isNearTie: ${isNearTie}, winner: ${winner.label}`
  );

  // --- Compute tradeoff relative to the fastest route ---
  const extraTravelMin =
    winner.metrics.durationMin - fastestRoute.metrics.durationMin;
  const heatMinutesSaved =
    fastestRoute.metrics.highHeatMinutes - winner.metrics.highHeatMinutes;
  const reductionPct =
    fastestRoute.metrics.highHeatMinutes > 0 && heatMinutesSaved > 0
      ? Math.round((heatMinutesSaved / fastestRoute.metrics.highHeatMinutes) * 100)
      : 0;

  // --- Build reason text ---
  let reason: string;

  if (usedTimeBudgetFallback) {
    const timePenalty = Math.round(
      lowestHeatRoute.metrics.durationMin - fastestRoute.metrics.durationMin,
    );
    reason =
      `The coolest available route would add ${timePenalty} minute${timePenalty !== 1 ? "s" : ""} ` +
      `of travel time — more than the 20% time budget. No meaningfully safer option exists ` +
      `within a reasonable time cost, so the fastest route is recommended instead.`;
  } else if (winner.id === fastestRoute.id && extraTravelMin === 0) {
    // The fastest route also has the lowest heat exposure
    reason = isNearTie
      ? "Routes showed minimal heat exposure difference; the fastest route is recommended as it also " +
        "has the lowest high-heat exposure, though the difference between routes is marginal."
      : "The fastest route also has the lowest high-heat exposure — it is the clear best choice.";
  } else if (isNearTie) {
    reason =
      `Routes showed minimal heat exposure difference (less than 1 minute apart in high-heat ` +
      `exposure). Recommended for having the lowest recorded exposure, though the difference ` +
      `is marginal and routes are effectively equivalent in heat terms.`;
  } else {
    const timeCostText =
      extraTravelMin > 0
        ? `${extraTravelMin} extra minute${extraTravelMin !== 1 ? "s" : ""} of walking`
        : "no additional travel time";
    reason =
      `This route meaningfully reduces time spent in high-heat conditions — saving ` +
      `${heatMinutesSaved} minute${heatMinutesSaved !== 1 ? "s" : ""} of high-heat exposure ` +
      `(${reductionPct}% less than the fastest route) for ${timeCostText}. ` +
      `It stays well within the acceptable 20% time-cost limit.`;
  }

  return {
    recommendedId: winner.id,
    selectedLabel: winner.label,
    reason,
    tradeoff: { extraTravelMin, heatMinutesSaved, reductionPct },
    isNearTie,
    usedTimeBudgetFallback,
  };
}

/**
 * Applies selection logic to a route array immutably:
 * returns a new array where exactly one route has `recommended: true`.
 *
 * This is the primary integration point — call it whenever route metrics
 * are (re)calculated to keep the RECOMMENDED tag in sync.
 */
export function applyRecommendation(routes: RouteOption[]): RouteOption[] {
  if (routes.length === 0) return routes;
  const result = selectRecommendedRoute(routes);
  return routes.map((r) => ({
    ...r,
    recommended: r.id === result.recommendedId,
  }));
}
