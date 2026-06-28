import type { Hub } from "../domain/types";

/**
 * Static hub list: major Kanto terminals and interchange stations.
 * Coordinates are approximate station locations (accurate to ~100m, which is
 * ample for the centroid pre-filter and the `geo:lat,lon` plan endpoint).
 *
 * Tiers feed the scoring bonus (tier1 = 600s, tier2 = 300s, tier3 = 0s):
 *   1 = mega terminal       (Yamanote super-hubs, regional gateways)
 *   2 = major interchange    (large transfer / regional terminal)
 *   3 = sub-major            (notable transfer or area center)
 *
 * The `to` side of a plan is queried as `geo:lat,lon` to avoid brittle
 * station-ID resolution; set `stationId` only if a resolved id is known.
 */
export const HUBS: Hub[] = [
  // ── tier 1: mega terminals ──────────────────────────────────────────────
  { name: "新宿", lat: 35.69, lon: 139.7, tier: 1 },
  { name: "渋谷", lat: 35.658, lon: 139.701, tier: 1 },
  { name: "池袋", lat: 35.729, lon: 139.711, tier: 1 },
  { name: "東京", lat: 35.681, lon: 139.767, tier: 1 },
  { name: "品川", lat: 35.628, lon: 139.738, tier: 1 },
  { name: "上野", lat: 35.714, lon: 139.777, tier: 1 },
  { name: "横浜", lat: 35.466, lon: 139.622, tier: 1 },
  { name: "大宮", lat: 35.906, lon: 139.624, tier: 1 },
  { name: "北千住", lat: 35.749, lon: 139.805, tier: 1 },

  // ── tier 2: major interchanges / regional terminals ─────────────────────
  // 23区内
  { name: "新橋", lat: 35.666, lon: 139.758, tier: 2 },
  { name: "秋葉原", lat: 35.698, lon: 139.773, tier: 2 },
  { name: "大手町", lat: 35.686, lon: 139.766, tier: 2 },
  { name: "高田馬場", lat: 35.712, lon: 139.703, tier: 2 },
  { name: "中野", lat: 35.706, lon: 139.666, tier: 2 },
  { name: "五反田", lat: 35.626, lon: 139.723, tier: 2 },
  { name: "目黒", lat: 35.634, lon: 139.716, tier: 2 },
  { name: "恵比寿", lat: 35.6467, lon: 139.71, tier: 2 },
  { name: "大崎", lat: 35.6197, lon: 139.7286, tier: 2 },
  { name: "蒲田", lat: 35.5626, lon: 139.716, tier: 2 },
  { name: "赤羽", lat: 35.7779, lon: 139.721, tier: 2 },
  { name: "日暮里", lat: 35.728, lon: 139.771, tier: 2 },
  { name: "錦糸町", lat: 35.697, lon: 139.814, tier: 2 },
  { name: "下北沢", lat: 35.6613, lon: 139.668, tier: 2 },
  // 多摩
  { name: "吉祥寺", lat: 35.703, lon: 139.58, tier: 2 },
  { name: "三鷹", lat: 35.7024, lon: 139.5604, tier: 2 },
  { name: "国分寺", lat: 35.7003, lon: 139.4805, tier: 2 },
  { name: "立川", lat: 35.698, lon: 139.413, tier: 2 },
  { name: "八王子", lat: 35.6557, lon: 139.3389, tier: 2 },
  { name: "町田", lat: 35.541, lon: 139.447, tier: 2 },
  // 神奈川
  { name: "川崎", lat: 35.531, lon: 139.697, tier: 2 },
  { name: "武蔵小杉", lat: 35.576, lon: 139.659, tier: 2 },
  { name: "武蔵溝ノ口", lat: 35.5997, lon: 139.6105, tier: 2 },
  { name: "新横浜", lat: 35.5078, lon: 139.6172, tier: 2 },
  { name: "大船", lat: 35.354, lon: 139.5316, tier: 2 },
  { name: "藤沢", lat: 35.3389, lon: 139.4889, tier: 2 },
  // 埼玉
  { name: "浦和", lat: 35.8617, lon: 139.6571, tier: 2 },
  { name: "川口", lat: 35.8079, lon: 139.7197, tier: 2 },
  { name: "所沢", lat: 35.7989, lon: 139.469, tier: 2 },
  { name: "川越", lat: 35.9078, lon: 139.4818, tier: 2 },
  // 千葉
  { name: "千葉", lat: 35.613, lon: 140.113, tier: 2 },
  { name: "西船橋", lat: 35.707, lon: 139.86, tier: 2 },
  { name: "船橋", lat: 35.7016, lon: 139.9856, tier: 2 },
  { name: "松戸", lat: 35.7878, lon: 139.9009, tier: 2 },

  // ── tier 3: sub-major (notable transfer / area center) ──────────────────
  // 23区内・山手線沿線
  { name: "有楽町", lat: 35.6749, lon: 139.763, tier: 3 },
  { name: "浜松町", lat: 35.6553, lon: 139.757, tier: 3 },
  { name: "田町", lat: 35.6457, lon: 139.7476, tier: 3 },
  { name: "大井町", lat: 35.6064, lon: 139.734, tier: 3 },
  { name: "神田", lat: 35.6918, lon: 139.771, tier: 3 },
  { name: "御茶ノ水", lat: 35.6996, lon: 139.7649, tier: 3 },
  { name: "四ツ谷", lat: 35.6862, lon: 139.73, tier: 3 },
  { name: "市ヶ谷", lat: 35.6917, lon: 139.7357, tier: 3 },
  { name: "飯田橋", lat: 35.7021, lon: 139.7448, tier: 3 },
  { name: "巣鴨", lat: 35.7335, lon: 139.739, tier: 3 },
  { name: "田端", lat: 35.738, lon: 139.7608, tier: 3 },
  { name: "王子", lat: 35.7527, lon: 139.738, tier: 3 },
  { name: "荻窪", lat: 35.7046, lon: 139.62, tier: 3 },
  // 城東・湾岸
  { name: "浅草", lat: 35.7119, lon: 139.7983, tier: 3 },
  { name: "押上", lat: 35.7107, lon: 139.8133, tier: 3 },
  { name: "両国", lat: 35.696, lon: 139.7933, tier: 3 },
  { name: "豊洲", lat: 35.6549, lon: 139.7967, tier: 3 },
  { name: "新小岩", lat: 35.7166, lon: 139.8585, tier: 3 },
  { name: "綾瀬", lat: 35.7622, lon: 139.8252, tier: 3 },
  // 城南・東急沿線
  { name: "中目黒", lat: 35.6442, lon: 139.6993, tier: 3 },
  { name: "三軒茶屋", lat: 35.6435, lon: 139.6705, tier: 3 },
  { name: "自由が丘", lat: 35.6076, lon: 139.669, tier: 3 },
  { name: "二子玉川", lat: 35.6118, lon: 139.6266, tier: 3 },
  { name: "明大前", lat: 35.6686, lon: 139.6492, tier: 3 },
  // 多摩
  { name: "拝島", lat: 35.7196, lon: 139.354, tier: 3 },
  { name: "橋本", lat: 35.5947, lon: 139.3447, tier: 3 },
  // 神奈川
  { name: "桜木町", lat: 35.451, lon: 139.6313, tier: 3 },
  { name: "関内", lat: 35.4438, lon: 139.6363, tier: 3 },
  { name: "鶴見", lat: 35.5079, lon: 139.676, tier: 3 },
  { name: "上大岡", lat: 35.4068, lon: 139.597, tier: 3 },
  { name: "戸塚", lat: 35.4007, lon: 139.534, tier: 3 },
  { name: "登戸", lat: 35.6203, lon: 139.5697, tier: 3 },
  { name: "海老名", lat: 35.453, lon: 139.39, tier: 3 },
  { name: "本厚木", lat: 35.4413, lon: 139.3653, tier: 3 },
  { name: "相模大野", lat: 35.531, lon: 139.4364, tier: 3 },
  { name: "中央林間", lat: 35.5106, lon: 139.4445, tier: 3 },
  { name: "大和", lat: 35.4677, lon: 139.4615, tier: 3 },
  { name: "小田原", lat: 35.2562, lon: 139.1556, tier: 3 },
  // 埼玉
  { name: "武蔵浦和", lat: 35.847, lon: 139.6431, tier: 3 },
  { name: "南浦和", lat: 35.8366, lon: 139.675, tier: 3 },
  { name: "和光市", lat: 35.7813, lon: 139.6056, tier: 3 },
  { name: "朝霞台", lat: 35.8089, lon: 139.5933, tier: 3 },
  { name: "春日部", lat: 35.9758, lon: 139.7521, tier: 3 },
  { name: "南越谷", lat: 35.8896, lon: 139.7906, tier: 3 },
  { name: "草加", lat: 35.8255, lon: 139.8055, tier: 3 },
  { name: "熊谷", lat: 36.139, lon: 139.3886, tier: 3 },
  // 千葉
  { name: "津田沼", lat: 35.691, lon: 140.019, tier: 3 },
  { name: "海浜幕張", lat: 35.6483, lon: 140.0356, tier: 3 },
  { name: "市川", lat: 35.7216, lon: 139.9069, tier: 3 },
  { name: "本八幡", lat: 35.7217, lon: 139.9285, tier: 3 },
  { name: "新浦安", lat: 35.6573, lon: 139.9156, tier: 3 },
  { name: "柏", lat: 35.862, lon: 139.971, tier: 3 },
  { name: "流山おおたかの森", lat: 35.8707, lon: 139.9255, tier: 3 },
  { name: "我孫子", lat: 35.8643, lon: 140.028, tier: 3 },
  // 茨城南部（TX沿線）
  { name: "守谷", lat: 35.9515, lon: 139.9753, tier: 3 },
  { name: "取手", lat: 35.9114, lon: 140.0506, tier: 3 },
  { name: "つくば", lat: 36.0827, lon: 140.1117, tier: 3 },
];
