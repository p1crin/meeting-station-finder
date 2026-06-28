import type { Hub, LegResult, ScoredResult } from "./types";

// Tunable scoring constants (exposed for adjustment; no UI slider needed).
export const ALPHA = 0.5; // weight on spread (fairness / equalization)
export const BETA = 1.0; // weight on the big-station bonus

// Bonus in seconds, subtracted from the score, by hub tier.
export const HUB_BONUS: Record<Hub["tier"], number> = {
  1: 600,
  2: 300,
  3: 0,
};

function mean(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function stdev(xs: number[]): number {
  if (xs.length <= 1) return 0;
  const m = mean(xs);
  const variance = mean(xs.map((x) => (x - m) ** 2));
  return Math.sqrt(variance);
}

const TIER_LABEL: Record<Hub["tier"], string> = {
  1: "ターミナル",
  2: "主要駅",
  3: "準主要駅",
};

/** Build the one-line rationale: lead time + spread + tier. */
export function buildReason(
  hub: Hub,
  maxSecs: number,
  stdevSecs: number,
): string {
  const maxMin = Math.round(maxSecs / 60);
  const spread =
    stdevSecs < 240
      ? "ばらつき小"
      : stdevSecs < 600
        ? "ばらつき中"
        : "ばらつき大";
  return `最大${maxMin}分・${spread}・${TIER_LABEL[hub.tier]}(${hub.name})`;
}

/** Score a single candidate hub from its per-person legs. */
export function scoreCandidate(hub: Hub, legs: LegResult[]): ScoredResult {
  const durations = legs.map((l) => l.durationSecs);
  const feasible =
    legs.length > 0 && durations.every((d): d is number => d !== null);

  if (!feasible) {
    return {
      hub,
      legs,
      maxSecs: Infinity,
      meanSecs: Infinity,
      stdevSecs: Infinity,
      score: Infinity,
      reason: "一部の人にルートが見つかりません",
      feasible: false,
    };
  }

  const ds = durations as number[];
  const maxSecs = Math.max(...ds);
  const meanSecs = mean(ds);
  const stdevSecs = stdev(ds);
  const score = maxSecs + ALPHA * stdevSecs - BETA * HUB_BONUS[hub.tier];

  return {
    hub,
    legs,
    maxSecs,
    meanSecs,
    stdevSecs,
    score,
    reason: buildReason(hub, maxSecs, stdevSecs),
    feasible: true,
  };
}

/**
 * Score every candidate and return the feasible ones, best first.
 * Tie-break: lower score, then smaller spread, then higher tier (1 above 3).
 */
export function rankCandidates(
  scored: Array<{ hub: Hub; legs: LegResult[] }>,
  topN = 5,
): ScoredResult[] {
  return scored
    .map(({ hub, legs }) => scoreCandidate(hub, legs))
    .filter((r) => r.feasible)
    .sort(
      (a, b) =>
        a.score - b.score ||
        a.stdevSecs - b.stdevSecs ||
        a.hub.tier - b.hub.tier,
    )
    .slice(0, topN);
}
