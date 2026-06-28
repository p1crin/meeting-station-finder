import { apiGet } from "./client";
import type { PlanRequest, PlanResult } from "./transitProvider";

type Journey = {
  durationSecs: number;
  transferCount: number;
  fare?: { currency: string; ticket: number; ic?: number };
};

type PlanResponse = {
  journeys?: Journey[];
};

/**
 * GET /api/v1/plan — fastest route for one (from → to) pair, normalized to the
 * three numbers we actually use.
 *
 * - 422 means "same endpoint" (the person is already at this hub) → 0 secs.
 * - 404 or an empty `journeys` array means no route → null.
 * - Otherwise pick the journey with the smallest `durationSecs`.
 */
export async function planDuration(
  req: PlanRequest,
  signal?: AbortSignal,
): Promise<PlanResult> {
  const { from, to, conditions } = req;
  const res = await apiGet<PlanResponse>(
    "/api/v1/plan",
    {
      from,
      to,
      date: conditions.date,
      time: conditions.time,
      type: conditions.type,
      numItineraries: 1,
    },
    signal,
  );

  // Same start/end point → this person is already here.
  if (res.status === 422) {
    return { durationSecs: 0, transferCount: 0, fareIc: 0 };
  }

  const journeys = res.data?.journeys ?? [];
  if (res.status === 404 || journeys.length === 0) {
    return { durationSecs: null, transferCount: null, fareIc: null };
  }

  const best = journeys.reduce((a, b) =>
    b.durationSecs < a.durationSecs ? b : a,
  );
  return {
    durationSecs: best.durationSecs,
    transferCount: best.transferCount,
    fareIc: best.fare?.ic ?? best.fare?.ticket ?? null,
  };
}
