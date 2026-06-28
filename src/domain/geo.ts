import type { LatLon } from "./types";

const EARTH_RADIUS_M = 6_371_000;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Great-circle distance between two coordinates, in meters (Haversine). */
export function haversine(a: LatLon, b: LatLon): number {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Arithmetic mean of a set of coordinates. Participants are within a compact
 * region, so a planar average is accurate enough for candidate pre-filtering.
 */
export function centroid(points: LatLon[]): LatLon {
  if (points.length === 0) {
    throw new Error("centroid() requires at least one point");
  }
  const sum = points.reduce(
    (acc, p) => ({ lat: acc.lat + p.lat, lon: acc.lon + p.lon }),
    { lat: 0, lon: 0 },
  );
  return { lat: sum.lat / points.length, lon: sum.lon / points.length };
}
