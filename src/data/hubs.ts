import type { Hub } from "../domain/types";

/**
 * Static hub list: major Kanto terminals. Coordinates are approximate station
 * locations; the candidate pre-filter and `geo:lat,lon` plan endpoint tolerate
 * small offsets. Extend this list to widen coverage.
 *
 * The `to` side of a plan is queried as `geo:lat,lon` to avoid brittle
 * station-ID resolution; set `stationId` here only if a resolved id is known.
 */
export const HUBS: Hub[] = [
  // tier 1: mega terminals
  { name: "新宿", lat: 35.69, lon: 139.7, tier: 1 },
  { name: "渋谷", lat: 35.658, lon: 139.701, tier: 1 },
  { name: "池袋", lat: 35.729, lon: 139.711, tier: 1 },
  { name: "東京", lat: 35.681, lon: 139.767, tier: 1 },
  { name: "品川", lat: 35.628, lon: 139.738, tier: 1 },
  { name: "上野", lat: 35.714, lon: 139.777, tier: 1 },
  { name: "横浜", lat: 35.466, lon: 139.622, tier: 1 },
  { name: "大宮", lat: 35.906, lon: 139.624, tier: 1 },
  { name: "北千住", lat: 35.749, lon: 139.805, tier: 1 },
  // tier 2: major
  { name: "新橋", lat: 35.666, lon: 139.758, tier: 2 },
  { name: "秋葉原", lat: 35.698, lon: 139.773, tier: 2 },
  { name: "高田馬場", lat: 35.712, lon: 139.703, tier: 2 },
  { name: "中野", lat: 35.706, lon: 139.666, tier: 2 },
  { name: "吉祥寺", lat: 35.703, lon: 139.58, tier: 2 },
  { name: "立川", lat: 35.698, lon: 139.413, tier: 2 },
  { name: "町田", lat: 35.541, lon: 139.447, tier: 2 },
  { name: "川崎", lat: 35.531, lon: 139.697, tier: 2 },
  { name: "武蔵小杉", lat: 35.576, lon: 139.659, tier: 2 },
  { name: "大手町", lat: 35.686, lon: 139.766, tier: 2 },
  { name: "五反田", lat: 35.626, lon: 139.723, tier: 2 },
  { name: "日暮里", lat: 35.728, lon: 139.771, tier: 2 },
  { name: "錦糸町", lat: 35.697, lon: 139.814, tier: 2 },
  { name: "西船橋", lat: 35.707, lon: 139.86, tier: 2 },
  { name: "千葉", lat: 35.613, lon: 140.113, tier: 2 },
  // tier 3: sub-major
  { name: "海老名", lat: 35.453, lon: 139.39, tier: 3 },
  { name: "柏", lat: 35.862, lon: 139.971, tier: 3 },
  { name: "津田沼", lat: 35.691, lon: 140.019, tier: 3 },
];
