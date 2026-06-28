import { describe, expect, it } from "vitest";
import { selectCandidates } from "./candidates";
import type { Hub, Person } from "./types";

const hubs: Hub[] = [
  { name: "near", lat: 35.7, lon: 139.7, tier: 1 },
  { name: "mid", lat: 35.9, lon: 139.7, tier: 2 },
  { name: "far", lat: 36.5, lon: 139.7, tier: 3 },
];

const person = (lat: number, lon: number): Person => ({
  id: `p-${lat}`,
  stationId: "x:y",
  stationName: "x",
  lat,
  lon,
});

describe("selectCandidates", () => {
  it("returns hubs ordered by distance to the centroid", () => {
    const persons = [person(35.69, 139.7), person(35.71, 139.7)]; // centroid ~35.70
    const result = selectCandidates(persons, hubs, 3);
    expect(result.map((h) => h.name)).toEqual(["near", "mid", "far"]);
  });

  it("limits to K results", () => {
    const persons = [person(35.7, 139.7)];
    expect(selectCandidates(persons, hubs, 2)).toHaveLength(2);
  });

  it("returns an empty list when there are no persons", () => {
    expect(selectCandidates([], hubs, 3)).toEqual([]);
  });
});
