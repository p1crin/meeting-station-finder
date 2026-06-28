import { useMemo, useState } from "react";
import PersonInputList, {
  createInitialSlots,
  type PersonSlot,
} from "./components/PersonInputList";
import DateTimePicker from "./components/DateTimePicker";
import ResultList from "./components/ResultList";
import { useMeetingSearch } from "./hooks/useMeetingSearch";
import type { Person, SearchConditions } from "./domain/types";
import { nextSaturday, toYmd } from "./lib/format";

function defaultConditions(): SearchConditions {
  return { date: toYmd(nextSaturday()), time: "14:00", type: "arrival" };
}

type Committed = { persons: Person[]; conditions: SearchConditions };

export default function App() {
  const [slots, setSlots] = useState<PersonSlot[]>(createInitialSlots);
  const [conditions, setConditions] = useState<SearchConditions>(
    defaultConditions,
  );
  const [committed, setCommitted] = useState<Committed | null>(null);

  const validPersons = useMemo(
    () => slots.map((s) => s.person).filter((p): p is Person => p !== null),
    [slots],
  );
  const canSearch = validPersons.length >= 2;

  const search = useMeetingSearch(
    committed?.persons ?? [],
    committed?.conditions ?? conditions,
    committed !== null,
  );

  function onSearch() {
    if (!canSearch) return;
    setCommitted({ persons: validPersons, conditions });
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[640px] px-md pb-24 pt-12 sm:pt-16">
        <header className="border-b border-limestone-line pb-md">
          <p className="label-caps">Meeting Station Finder</p>
          <h1 className="mt-2 font-sans text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            待ち合わせ駅
            <br />
            ファインダー
          </h1>
          <p className="mt-md max-w-prose text-sm leading-relaxed text-slate">
            最大5人の最寄り駅から、電車での移動時間が公平で、できれば大きな駅になる
            待ち合わせ候補をランキングします。
          </p>
        </header>

        <main className="mt-12 space-y-12">
          <PersonInputList slots={slots} onChange={setSlots} />

          <DateTimePicker value={conditions} onChange={setConditions} />

          <div>
            <button
              type="button"
              onClick={onSearch}
              disabled={!canSearch}
              className="w-full rounded-sm bg-clay px-md py-3.5 font-grotesk text-sm font-medium uppercase tracking-caps text-limestone transition-colors hover:enabled:bg-clay-hover disabled:cursor-not-allowed disabled:bg-slate/30 disabled:text-slate"
            >
              待ち合わせ駅を探す
            </button>
            {!canSearch && (
              <p className="mt-2 text-center text-xs text-slate">
                参加者を2人以上選んでください。
              </p>
            )}
          </div>

          <ResultList state={search} started={committed !== null} />
        </main>

        <footer className="mt-16 border-t border-limestone-line pt-md">
          <p className="text-xs leading-relaxed text-slate">
            経路情報は{" "}
            <a
              href="https://api.transit.ls8h.com"
              className="text-clay underline-offset-2 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Transit API
            </a>{" "}
            を利用。候補駅は関東主要ターミナルの静的リストから抽出しています。
          </p>
        </footer>
      </div>
    </div>
  );
}
