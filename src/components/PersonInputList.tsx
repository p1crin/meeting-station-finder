import StationInput from "./StationInput";
import type { Person } from "../domain/types";

export type PersonSlot = { key: string; person: Person | null };

type Props = {
  slots: PersonSlot[];
  onChange: (slots: PersonSlot[]) => void;
};

const MIN = 2;
const MAX = 5;

let nextKey = 100;
const makeSlot = (): PersonSlot => ({ key: `s-${nextKey++}`, person: null });

export function createInitialSlots(): PersonSlot[] {
  return [makeSlot(), makeSlot()];
}

export default function PersonInputList({ slots, onChange }: Props) {
  function setPerson(i: number, person: Person | null) {
    onChange(slots.map((s, idx) => (idx === i ? { ...s, person } : s)));
  }
  function add() {
    if (slots.length < MAX) onChange([...slots, makeSlot()]);
  }
  function remove(i: number) {
    if (slots.length > MIN) onChange(slots.filter((_, idx) => idx !== i));
  }

  return (
    <section>
      <div className="mb-md flex items-baseline justify-between">
        <h2 className="font-grotesk text-sm font-medium uppercase tracking-caps text-slate">
          参加者
        </h2>
        <span className="label-caps">{slots.length} / {MAX} 人</span>
      </div>

      <div className="space-y-md">
        {slots.map((s, i) => (
          <div key={s.key} className="flex items-start gap-sm">
            <div className="flex-1">
              <StationInput
                index={i}
                value={s.person}
                onChange={(p) => setPerson(i, p)}
              />
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              disabled={slots.length <= MIN}
              aria-label={`参加者 ${i + 1} を削除`}
              className="mt-[2px] h-9 w-9 shrink-0 rounded-sm border border-limestone-line text-slate transition-colors hover:enabled:border-clay hover:enabled:text-clay disabled:opacity-30"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        disabled={slots.length >= MAX}
        className="mt-md font-grotesk text-xs font-medium uppercase tracking-caps text-clay transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:text-slate disabled:opacity-40"
      >
        ＋ 参加者を追加
      </button>
    </section>
  );
}
