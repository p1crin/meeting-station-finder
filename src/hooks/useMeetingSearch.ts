import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { transit } from "../api/transitProvider";
import { HUBS } from "../data/hubs";
import { selectCandidates } from "../domain/candidates";
import { rankCandidates, scoreCandidate } from "../domain/score";
import type {
  Hub,
  LegResult,
  Person,
  ScoredResult,
  SearchConditions,
} from "../domain/types";

const DAY_MS = 24 * 60 * 60 * 1000;
const K = 8; // candidate hubs per search

export type MeetingSearchState = {
  results: ScoredResult[]; // ranked, feasible only, best first
  excluded: Hub[]; // candidates dropped because someone had no route
  progress: { done: number; total: number };
  isSearching: boolean;
  isComplete: boolean;
  hasError: boolean;
};

function hubEndpoint(hub: Hub): string {
  // Prefer a resolved station id; otherwise query by coordinates to avoid
  // brittle id resolution.
  return hub.stationId ?? `geo:${hub.lat},${hub.lon}`;
}

/**
 * Orchestrates a meeting search: K candidate hubs × N people plan queries,
 * throttled at the fetch layer, then scored and ranked. Each (from, to,
 * conditions) pair is its own cached query, so re-searching identical
 * conditions is free.
 */
export function useMeetingSearch(
  persons: Person[],
  conditions: SearchConditions,
  enabled: boolean,
): MeetingSearchState {
  const candidates = useMemo(
    () => (enabled ? selectCandidates(persons, HUBS, K) : []),
    [enabled, persons],
  );

  // Flattened in candidate-major order: index = candidateIndex * N + personIndex.
  const pairs = useMemo(
    () =>
      candidates.flatMap((hub) =>
        persons.map((person) => ({ hub, person })),
      ),
    [candidates, persons],
  );

  const queries = useQueries({
    queries: pairs.map(({ hub, person }) => {
      const to = hubEndpoint(hub);
      return {
        queryKey: [
          "plan",
          person.stationId,
          to,
          conditions.date,
          conditions.time,
          conditions.type,
        ] as const,
        queryFn: ({ signal }: { signal: AbortSignal }) =>
          transit.plan({ from: person.stationId, to, conditions }, signal),
        enabled,
        staleTime: DAY_MS, // timetables are immutable for fixed conditions
        gcTime: DAY_MS,
        retry: false, // a single retry already happens in the fetch layer
      };
    }),
  });

  const total = pairs.length;
  const done = queries.filter((q) => q.isSuccess || q.isError).length;
  const isComplete = enabled && total > 0 && done === total;

  const { results, excluded, hasError } = useMemo(() => {
    const n = persons.length;
    const grouped = candidates.map((hub, ci) => {
      const legs: LegResult[] = persons.map((person, pi) => {
        const q = queries[ci * n + pi];
        const data = q?.data;
        return {
          person,
          durationSecs: data?.durationSecs ?? null,
          transferCount: data?.transferCount ?? null,
          fareIc: data?.fareIc ?? null,
        };
      });
      return { hub, legs };
    });

    const ranked = rankCandidates(grouped, 5);
    const excludedHubs = isComplete
      ? grouped
          .filter(({ hub, legs }) => !scoreCandidate(hub, legs).feasible)
          .map(({ hub }) => hub)
      : [];

    return {
      results: ranked,
      excluded: excludedHubs,
      hasError: total > 0 && queries.every((q) => q.isError),
    };
    // queries identity changes each render; gate the recompute on progress.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidates, persons, done, total, isComplete]);

  return {
    results,
    excluded,
    progress: { done, total },
    isSearching: enabled && total > 0 && !isComplete,
    isComplete,
    hasError,
  };
}
