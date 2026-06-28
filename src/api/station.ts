import { apiGet } from "./client";
import type { StationDetail } from "./transitProvider";

type StationResponse = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  routes?: unknown[];
};

/**
 * GET /api/v1/stations/{id} — used only to backfill `lat`/`lon` when the
 * suggest endpoint omitted them.
 */
export async function getStation(
  id: string,
  signal?: AbortSignal,
): Promise<StationDetail> {
  const res = await apiGet<StationResponse>(
    `/api/v1/stations/${encodeURIComponent(id)}`,
    {},
    signal,
  );
  if (!res.ok || !res.data) {
    throw new Error(`station ${id} not found (${res.status})`);
  }
  const { id: rid, name, lat, lon } = res.data;
  return { id: rid, name, lat, lon };
}
