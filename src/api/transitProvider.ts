// The Transit API is an unsanctioned, no-SLA personal project. Every call goes
// through this interface so the concrete implementation can be swapped (or
// mocked in tests) without touching the orchestration or UI layers.

import type { SearchConditions } from "../domain/types";
import { suggestStations } from "./suggest";
import { planDuration } from "./plan";
import { getStation } from "./station";

export type SuggestStation = {
  id: string; // feedId:stopId
  name: string;
  nameKana?: string;
  feedId: string;
  feedName: string;
  score: number;
  weight: number;
  lat?: number; // optional — may be missing
  lon?: number; // optional — may be missing
  kind?: "station" | "stop";
};

export type StationDetail = {
  id: string;
  name: string;
  lat: number; // required on this endpoint
  lon: number;
};

/** An endpoint is either a station id (`feedId:stopId`) or `geo:lat,lon`. */
export type Endpoint = string;

export type PlanRequest = {
  from: Endpoint;
  to: Endpoint;
  conditions: SearchConditions;
};

export type PlanResult = {
  durationSecs: number | null; // null = no route
  transferCount: number | null;
  fareIc: number | null;
};

export interface TransitProvider {
  suggest(q: string, limit?: number, signal?: AbortSignal): Promise<SuggestStation[]>;
  plan(req: PlanRequest, signal?: AbortSignal): Promise<PlanResult>;
  station(id: string, signal?: AbortSignal): Promise<StationDetail>;
}

/** Default implementation backed by the live HTTP API. */
export const transit: TransitProvider = {
  suggest: suggestStations,
  plan: planDuration,
  station: getStation,
};
