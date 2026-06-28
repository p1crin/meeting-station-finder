import type { MeetingSearchState } from "../hooks/useMeetingSearch";
import ResultCard from "./ResultCard";

type Props = {
  state: MeetingSearchState;
  started: boolean;
};

export default function ResultList({ state, started }: Props) {
  const { results, excluded, progress, isSearching, isComplete, hasError } =
    state;

  if (!started) return null;

  return (
    <section aria-live="polite">
      <div className="mb-md flex items-baseline justify-between">
        <h2 className="font-grotesk text-sm font-medium uppercase tracking-caps text-slate">
          候補ランキング
        </h2>
        {isSearching && (
          <span className="label-caps tabular-nums">
            {progress.done} / {progress.total} 候補を評価中
          </span>
        )}
      </div>

      {isSearching && (
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-limestone-deep">
          <div
            className="h-full bg-clay transition-[width] duration-300"
            style={{
              width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%`,
            }}
          />
        </div>
      )}

      {hasError && (
        <p className="rounded-md border border-limestone-line bg-clay-soft p-md text-sm text-ink">
          経路情報を取得できませんでした。時間をおいて再度お試しください。
        </p>
      )}

      {isComplete && !hasError && results.length === 0 && (
        <p className="rounded-md border border-limestone-line bg-white/40 p-md text-sm text-slate">
          適切な候補が見つかりませんでした。参加者や日時の条件を見直してください。
        </p>
      )}

      <div className="space-y-md">
        {results.map((r, i) => (
          <ResultCard key={r.hub.name} result={r} rank={i + 1} />
        ))}
      </div>

      {isComplete && excluded.length > 0 && (
        <p className="mt-md text-xs text-slate">
          ルートが見つからず除外:{" "}
          {excluded.map((h) => h.name).join("・")}
        </p>
      )}
    </section>
  );
}
