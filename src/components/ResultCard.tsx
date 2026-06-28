import type { ScoredResult } from "../domain/types";
import { formatDuration, formatFare, formatTransfers } from "../lib/format";

const TIER_BADGE: Record<1 | 2 | 3, string> = {
  1: "ターミナル",
  2: "主要駅",
  3: "準主要駅",
};

type Props = {
  result: ScoredResult;
  rank: number; // 1-based
};

export default function ResultCard({ result, rank }: Props) {
  const winner = rank === 1;
  const { hub, legs, maxSecs, reason } = result;

  return (
    <article
      className={`rounded-md border p-md ${
        winner
          ? "border-ink bg-ink text-limestone"
          : "border-limestone-line bg-white/40 text-ink"
      }`}
    >
      <header className="flex items-start justify-between gap-sm">
        <div>
          <div className="flex items-center gap-sm">
            <span
              className={`font-grotesk text-xs font-medium tabular-nums ${
                winner ? "text-clay" : "text-slate"
              }`}
            >
              {String(rank).padStart(2, "0")}
            </span>
            <h3 className="font-sans text-2xl font-bold leading-none tracking-tight">
              {hub.name}
            </h3>
            <span
              className={`label-caps normal-case ${
                winner ? "text-limestone/70" : "text-slate"
              }`}
            >
              {TIER_BADGE[hub.tier]}
            </span>
          </div>
          <p
            className={`mt-2 text-sm ${winner ? "text-limestone/80" : "text-slate"}`}
          >
            {reason}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <div className="label-caps">最大所要</div>
          <div className="font-sans text-xl font-semibold tabular-nums">
            {formatDuration(maxSecs)}
          </div>
        </div>
      </header>

      <ul
        className={`mt-md divide-y ${
          winner ? "divide-limestone/15" : "divide-limestone-line"
        }`}
      >
        {legs.map((leg) => (
          <li
            key={leg.person.id}
            className="flex items-center justify-between gap-sm py-2 text-sm"
          >
            <span className="truncate font-medium">{leg.person.stationName}</span>
            <span
              className={`flex shrink-0 items-center gap-3 tabular-nums ${
                winner ? "text-limestone/80" : "text-slate"
              }`}
            >
              <span className="font-semibold text-current">
                {formatDuration(leg.durationSecs)}
              </span>
              <span>{formatTransfers(leg.transferCount)}</span>
              <span>{formatFare(leg.fareIc)}</span>
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
