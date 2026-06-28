// Domain types. Kept free of any API/UI concerns so the scoring and geometry
// helpers can be unit-tested as pure functions.

export type Person = {
  id: string; // UI-local unique key
  stationId: string; // feedId:stopId
  stationName: string;
  lat: number; // always filled (completed via stations/{id} if needed)
  lon: number;
};

export type Hub = {
  name: string;
  lat: number;
  lon: number;
  tier: 1 | 2 | 3; // 1 = mega terminal, 2 = major, 3 = sub-major
  stationId?: string; // resolved feedId:stopId (optional)
};

export type SearchConditions = {
  date: string; // YYYYMMDD
  time: string; // HH:MM
  type: "departure" | "arrival"; // default "arrival"
};

export type LegResult = {
  person: Person;
  durationSecs: number | null; // null = no route
  transferCount: number | null;
  fareIc: number | null;
};

export type ScoredResult = {
  hub: Hub;
  legs: LegResult[]; // per participant
  maxSecs: number;
  meanSecs: number;
  stdevSecs: number;
  score: number; // lower is better
  reason: string; // one-line rationale
  feasible: boolean; // does everyone have a route?
};

export type LatLon = { lat: number; lon: number };
