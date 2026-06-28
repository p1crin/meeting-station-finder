/** seconds → "M分" / "H時間M分" */
export function formatDuration(secs: number | null): string {
  if (secs === null) return "—";
  if (secs <= 0) return "0分";
  const totalMin = Math.round(secs / 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}分`;
  if (m === 0) return `${h}時間`;
  return `${h}時間${m}分`;
}

/** yen → "¥1,234" */
export function formatFare(yen: number | null): string {
  if (yen === null) return "—";
  return `¥${yen.toLocaleString("ja-JP")}`;
}

export function formatTransfers(count: number | null): string {
  if (count === null) return "—";
  return count === 0 ? "乗換なし" : `乗換${count}回`;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Date → "YYYYMMDD" (local). */
export function toYmd(d: Date): string {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

/** "YYYYMMDD" → "YYYY-MM-DD" for <input type="date">. */
export function ymdToIso(ymd: string): string {
  return `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
}

/** "YYYY-MM-DD" → "YYYYMMDD". */
export function isoToYmd(iso: string): string {
  return iso.replace(/-/g, "");
}

/** The next Saturday from `from` (today if already Saturday is treated as next week). */
export function nextSaturday(from = new Date()): Date {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const day = d.getDay(); // 0 Sun … 6 Sat
  const delta = (6 - day + 7) % 7 || 7; // always move to the upcoming Saturday
  d.setDate(d.getDate() + delta);
  return d;
}
