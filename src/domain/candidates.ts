import { centroid, haversine } from "./geo";
import type { Hub, Person } from "./types";

/**
 * Pick the K hubs closest to the participants' centroid.
 *
 * The candidate source is the static hub list only — a deliberate
 * simplification. Within the initial (Kanto) scope this is acceptable; outside
 * it the centroid may drift away from any hub.
 */
export function selectCandidates(
  persons: Person[],
  hubs: Hub[],
  K = 8,
): Hub[] {
  if (persons.length === 0) return [];
  const c = centroid(persons.map((p) => ({ lat: p.lat, lon: p.lon })));
  return [...hubs]
    .sort((a, b) => haversine(c, a) - haversine(c, b))
    .slice(0, K);
}
