import { describe, expect, it } from "vitest";
import { centroid, haversine } from "./geo";

describe("haversine", () => {
  it("matches a known distance within ±1%", () => {
    // Tokyo Station → Shinjuku Station ≈ 6.0 km.
    const tokyo = { lat: 35.681, lon: 139.767 };
    const shinjuku = { lat: 35.69, lon: 139.7 };
    const d = haversine(tokyo, shinjuku);
    expect(d).toBeGreaterThan(6000 * 0.99);
    expect(d).toBeLessThan(6300 * 1.01);
  });

  it("is zero for identical points", () => {
    const p = { lat: 35.6, lon: 139.7 };
    expect(haversine(p, p)).toBe(0);
  });
});

describe("centroid", () => {
  it("averages a set of points", () => {
    const c = centroid([
      { lat: 0, lon: 0 },
      { lat: 2, lon: 4 },
      { lat: 4, lon: 8 },
    ]);
    expect(c.lat).toBeCloseTo(2, 10);
    expect(c.lon).toBeCloseTo(4, 10);
  });

  it("throws on an empty set", () => {
    expect(() => centroid([])).toThrow();
  });
});
