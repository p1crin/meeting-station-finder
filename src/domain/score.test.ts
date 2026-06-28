import { describe, expect, it } from "vitest";
import { rankCandidates, scoreCandidate } from "./score";
import type { Hub, LegResult, Person } from "./types";

const person = (n: number): Person => ({
  id: `p-${n}`,
  stationId: `feed:${n}`,
  stationName: `S${n}`,
  lat: 35,
  lon: 139,
});

const hub = (name: string, tier: 1 | 2 | 3): Hub => ({
  name,
  lat: 35,
  lon: 139,
  tier,
});

/** Build legs from a list of durations (null = no route). */
function legs(durations: Array<number | null>): LegResult[] {
  return durations.map((d, i) => ({
    person: person(i),
    durationSecs: d,
    transferCount: d === null ? null : 0,
    fareIc: d === null ? null : 200,
  }));
}

describe("scoreCandidate", () => {
  it("applies the tier bonus (bigger hubs score lower)", () => {
    const big = scoreCandidate(hub("渋谷", 1), legs([600, 600]));
    const small = scoreCandidate(hub("柏", 3), legs([600, 600]));
    expect(big.score).toBe(0); // 600 + 0 - 600
    expect(small.score).toBe(600); // 600 + 0 - 0
    expect(big.score).toBeLessThan(small.score);
  });

  it("aggregates a same-endpoint 0s leg correctly", () => {
    const r = scoreCandidate(hub("新宿", 1), legs([0, 600]));
    expect(r.feasible).toBe(true);
    expect(r.maxSecs).toBe(600);
    expect(r.meanSecs).toBe(300);
    expect(r.stdevSecs).toBe(300);
  });

  it("marks a candidate infeasible when any leg has no route", () => {
    const r = scoreCandidate(hub("品川", 1), legs([600, null]));
    expect(r.feasible).toBe(false);
    expect(r.score).toBe(Infinity);
  });
});

describe("rankCandidates", () => {
  it("orders feasible candidates by ascending score", () => {
    const ranked = rankCandidates([
      { hub: hub("柏", 3), legs: legs([600, 600]) }, // score 600
      { hub: hub("渋谷", 1), legs: legs([600, 600]) }, // score 0
      { hub: hub("中野", 2), legs: legs([600, 600]) }, // score 300
    ]);
    expect(ranked.map((r) => r.hub.name)).toEqual(["渋谷", "中野", "柏"]);
  });

  it("excludes candidates with a null leg", () => {
    const ranked = rankCandidates([
      { hub: hub("渋谷", 1), legs: legs([600, 600]) },
      { hub: hub("品川", 1), legs: legs([600, null]) },
    ]);
    expect(ranked.map((r) => r.hub.name)).toEqual(["渋谷"]);
  });

  it("breaks score ties by smaller spread", () => {
    // Both score 600: [600,600] has stdev 0, [400,560] has stdev 80.
    const ranked = rankCandidates([
      { hub: hub("ばらつき大", 3), legs: legs([400, 560]) },
      { hub: hub("ばらつき小", 3), legs: legs([600, 600]) },
    ]);
    expect(ranked.map((r) => r.hub.name)).toEqual(["ばらつき小", "ばらつき大"]);
  });
});
