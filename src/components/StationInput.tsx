import { useEffect, useId, useRef, useState } from "react";
import { transit } from "../api/transitProvider";
import type { SuggestStation } from "../api/transitProvider";
import { useStationSuggest } from "../hooks/useStationSuggest";
import type { Person } from "../domain/types";

type Props = {
  index: number;
  value: Person | null;
  onChange: (person: Person | null) => void;
};

/**
 * One participant's nearest-station field: debounced autocomplete, keyboard-free
 * click selection, and lat/lon backfill via stations/{id} when the suggest
 * payload omitted coordinates.
 */
export default function StationInput({ index, value, onChange }: Props) {
  const [text, setText] = useState(value?.stationName ?? "");
  const [open, setOpen] = useState(false);
  const [resolving, setResolving] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const { stations, isLoading } = useStationSuggest(open ? text : "");

  // Keep the field in sync when the parent replaces the selection.
  useEffect(() => {
    setText(value?.stationName ?? "");
  }, [value]);

  // Close the dropdown on outside click.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  async function select(s: SuggestStation) {
    setOpen(false);
    setText(s.name);
    let { lat, lon } = s;
    if (lat === undefined || lon === undefined) {
      // Coordinates are optional on suggest — backfill from station detail.
      try {
        setResolving(true);
        const detail = await transit.station(s.id);
        lat = detail.lat;
        lon = detail.lon;
      } catch {
        setResolving(false);
        return; // leave selection empty; user can retry
      }
      setResolving(false);
    }
    onChange({
      id: `p-${index}`,
      stationId: s.id,
      stationName: s.name,
      lat: lat!,
      lon: lon!,
    });
  }

  const showList = open && text.trim().length > 0;

  return (
    <div ref={wrapRef} className="relative">
      <div className="flex items-center gap-sm">
        <span className="label-caps shrink-0 w-12 tabular-nums">
          {`参加 ${index + 1}`}
        </span>
        <input
          type="text"
          inputMode="search"
          autoComplete="off"
          value={text}
          placeholder="最寄り駅を入力"
          aria-expanded={showList}
          aria-controls={listId}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setText(e.target.value);
            setOpen(true);
            if (value) onChange(null); // typing invalidates a prior selection
          }}
          className="w-full rounded-sm border border-limestone-line bg-white/40 px-3 py-2 text-ink outline-none transition-colors placeholder:text-slate/60 focus:border-clay focus:bg-white"
        />
      </div>

      {value && !showList && (
        <p className="mt-1 pl-[calc(3rem+0.5rem)] label-caps normal-case tracking-normal text-clay">
          選択済み · {value.stationName}
        </p>
      )}
      {resolving && (
        <p className="mt-1 pl-[calc(3rem+0.5rem)] label-caps text-slate">
          座標を取得中…
        </p>
      )}

      {showList && (
        <ul
          id={listId}
          className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-sm border border-limestone-line bg-limestone shadow-sm"
        >
          {isLoading && (
            <li className="px-3 py-2 label-caps text-slate">検索中…</li>
          )}
          {!isLoading && stations.length === 0 && (
            <li className="px-3 py-2 label-caps text-slate">
              候補が見つかりません
            </li>
          )}
          {stations.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => select(s)}
                className="flex w-full items-baseline justify-between gap-3 px-3 py-2 text-left hover:bg-limestone-deep"
              >
                <span className="text-ink">{s.name}</span>
                <span className="label-caps shrink-0 normal-case tracking-normal text-slate">
                  {s.feedName}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
