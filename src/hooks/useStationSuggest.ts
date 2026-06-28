import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { transit } from "../api/transitProvider";

/** Returns `value` delayed by `delayMs`, resetting the timer on each change. */
function useDebounced<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

/**
 * Station autocomplete with a 300ms debounce. Results are cached per query so
 * re-typing the same prefix never re-hits the API.
 */
export function useStationSuggest(input: string) {
  const q = useDebounced(input.trim(), 300);
  const query = useQuery({
    queryKey: ["suggest", q],
    queryFn: ({ signal }) => transit.suggest(q, 8, signal),
    enabled: q.length > 0,
    staleTime: 5 * 60 * 1000,
  });
  return {
    stations: query.data ?? [],
    isLoading: query.isFetching && q.length > 0,
    isError: query.isError,
  };
}
