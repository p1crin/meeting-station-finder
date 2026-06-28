import { apiGet } from "./client";
import type { SuggestStation } from "./transitProvider";

type SuggestResponse = { stations?: SuggestStation[] };

/** GET /api/v1/locations/suggest — station autocomplete. */
export async function suggestStations(
  q: string,
  limit = 8,
  signal?: AbortSignal,
): Promise<SuggestStation[]> {
  const query = q.trim();
  if (query.length === 0) return [];
  const res = await apiGet<SuggestResponse>(
    "/api/v1/locations/suggest",
    { q: query, limit },
    signal,
  );
  return res.data?.stations ?? [];
}
