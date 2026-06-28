import { apiGet } from "./client";
import type { SuggestStation } from "./transitProvider";

type SuggestResponse = { stations?: SuggestStation[] };

/**
 * Keep only rail-routable results. The suggest endpoint mixes in airline-feed
 * airport nodes (e.g. `odpt-ana:odpt.Airport:HND`) and bus stops, which the
 * plan API can't route as trains — selecting one yields a 422 and no usable
 * journey. Trams/streetcars are intentionally kept.
 */
export function isRailStation(s: SuggestStation): boolean {
  if (s.id.includes("odpt.Airport:")) return false; // airline flight node
  if (s.id.includes("odpt.BusstopPole:")) return false; // ODPT bus stop
  if (/bus|バス/i.test(s.feedName)) return false; // any bus operator
  return true;
}

/** GET /api/v1/locations/suggest — station autocomplete (rail only). */
export async function suggestStations(
  q: string,
  limit = 8,
  signal?: AbortSignal,
): Promise<SuggestStation[]> {
  const query = q.trim();
  if (query.length === 0) return [];
  // Over-fetch so filtering out air/bus nodes still leaves a full list.
  const res = await apiGet<SuggestResponse>(
    "/api/v1/locations/suggest",
    { q: query, limit: Math.min(30, limit + 6) },
    signal,
  );
  return (res.data?.stations ?? []).filter(isRailStation).slice(0, limit);
}
