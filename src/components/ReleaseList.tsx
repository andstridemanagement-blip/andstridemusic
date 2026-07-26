"use client";

import type { Track } from "../data/tracks";

type ReleaseListProps = {
  tracks: Track[];
  activeIndex: number;
  visible: boolean;
  disabled: boolean;
  onSelect: (index: number) => void;
};

export default function ReleaseList({
  tracks,
  activeIndex,
  visible,
  disabled,
  onSelect,
}: ReleaseListProps) {
  return (
    <aside
      className={`absolute right-10 top-1/2 z-20 hidden w-[235px] -translate-y-1/2 transition-all duration-700 xl:block ${
        visible
          ? "translate-x-0 opacity-100"
          : "translate-x-6 opacity-0"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[8px] uppercase tracking-[0.4em] text-white/20">
          Releases
        </p>

        <p className="font-mono text-[7px] text-white/15">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(tracks.length).padStart(2, "0")}
        </p>
      </div>

      <div className="space-y-2">
        {tracks.map((track, index) => {
          const active = index === activeIndex;

          return (
            <button
              key={track.slug}
              type="button"
              onClick={() => onSelect(index)}
              disabled={disabled}
              className={`group relative flex w-full items-center gap-3 overflow-hidden border px-4 py-3.5 text-left transition-all duration-300 ${
                active
                  ? "border-white/15 bg-white/[0.04] text-white"
                  : "border-white/[0.06] bg-black/10 text-white/25 hover:-translate-x-1 hover:border-white/15 hover:text-white/65"
              } disabled:cursor-not-allowed`}
            >
              <div
                className={`absolute bottom-0 left-0 top-0 w-px transition-opacity ${
                  active ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  backgroundColor: track.accent,
                  boxShadow: `0 0 15px ${track.accent}`,
                }}
              />

              <span className="w-6 font-mono text-[7px] text-white/15">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold uppercase tracking-[0.08em]">
                  {track.title}
                </p>

                <p className="mt-2 text-[7px] uppercase tracking-[0.18em] text-white/20">
                  {track.bpm} BPM • {track.musicalKey}
                </p>
              </div>

              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  active
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-30"
                }`}
                style={{
                  backgroundColor: track.accent,
                  boxShadow: `0 0 10px ${track.accent}`,
                }}
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
}