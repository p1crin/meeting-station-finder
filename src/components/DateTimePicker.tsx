import type { SearchConditions } from "../domain/types";
import { isoToYmd, ymdToIso } from "../lib/format";

type Props = {
  value: SearchConditions;
  onChange: (next: SearchConditions) => void;
};

export default function DateTimePicker({ value, onChange }: Props) {
  return (
    <section>
      <h2 className="mb-md font-grotesk text-sm font-medium uppercase tracking-caps text-slate">
        日時条件
      </h2>

      <div className="grid grid-cols-2 gap-sm">
        <label className="block">
          <span className="label-caps">日付</span>
          <input
            type="date"
            value={ymdToIso(value.date)}
            onChange={(e) =>
              e.target.value &&
              onChange({ ...value, date: isoToYmd(e.target.value) })
            }
            className="mt-1 w-full rounded-sm border border-limestone-line bg-white/40 px-3 py-2 text-ink outline-none focus:border-clay focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="label-caps">時刻</span>
          <input
            type="time"
            value={value.time}
            onChange={(e) =>
              e.target.value && onChange({ ...value, time: e.target.value })
            }
            className="mt-1 w-full rounded-sm border border-limestone-line bg-white/40 px-3 py-2 text-ink outline-none focus:border-clay focus:bg-white"
          />
        </label>
      </div>

      {/* Departure / arrival toggle — arrival is the default ("arrive by"). */}
      <div className="mt-md">
        <span className="label-caps">基準</span>
        <div className="mt-1 inline-flex rounded-sm border border-limestone-line p-[2px]">
          {(
            [
              ["arrival", "到着"],
              ["departure", "出発"],
            ] as const
          ).map(([type, label]) => {
            const active = value.type === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ ...value, type })}
                aria-pressed={active}
                className={`rounded-[3px] px-4 py-1.5 font-grotesk text-xs font-medium uppercase tracking-caps transition-colors ${
                  active
                    ? "bg-clay text-limestone"
                    : "text-slate hover:text-ink"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-slate">
          {value.type === "arrival"
            ? "この時刻に全員が到着できる経路で比較します。"
            : "この時刻に各自が出発する経路で比較します。"}
        </p>
      </div>
    </section>
  );
}
