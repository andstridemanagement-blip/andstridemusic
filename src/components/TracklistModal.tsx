"use client";

import type { Track } from "../data/tracks";

type TracklistModalProps = {
  open: boolean;
  tracks: Track[];
  currentTrackIndex: number;
  onSelectTrack: (index: number) => void;
  onClose: () => void;
};

const badges = {
  sold: {
    label: "Sold",
    className:
      "border-rose-300/20 bg-rose-300/[0.035] text-rose-200/60",
  },
  reserved: {
    label: "Reserved",
    className:
      "border-amber-300/20 bg-amber-300/[0.035] text-amber-200/60",
  },
  coming: {
    label: "Coming",
    className:
      "border-sky-300/20 bg-sky-300/[0.035] text-sky-200/60",
  },
} as const;

export default function TracklistModal({
  open,
  tracks,
  currentTrackIndex,
  onSelectTrack,
  onClose,
}: TracklistModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[900] flex justify-end">
      <button
        type="button"
        aria-label="Close archive"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <aside className="relative z-10 h-full w-full max-w-lg border-l border-white/10 bg-[#080808]/95 px-7 py-8 shadow-[-30px_0_100px_rgba(0,0,0,0.7)] md:px-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/30">
              Andstride Archive
            </p>

            <h2 className="mt-3 text-4xl font-black uppercase">
              Archive
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-3xl leading-none text-white/35 transition hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="mt-10 border-t border-white/10">
          {tracks.map((track, index) => {
            const active = index === currentTrackIndex;
            const badge =
              track.availability === "available"
                ? null
                : badges[track.availability];

            return (
              <button
                key={track.title}
                type="button"
                onClick={() => onSelectTrack(index)}
                className={`group flex w-full items-center gap-5 border-b border-white/10 py-6 text-left transition ${
                  active
                    ? "text-white"
                    : "text-white/40 hover:text-white"
                } ${
                  track.availability === "sold"
                    ? "bg-rose-300/[0.012]"
                    : ""
                }`}
              >
                <span className="w-8 font-mono text-[10px] text-white/25">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="truncate text-xl font-semibold uppercase tracking-[0.06em]">
                      {track.title}
                    </h3>

                    {badge && (
                      <span
                        className={`shrink-0 border px-2 py-1 text-[6px] uppercase tracking-[0.26em] ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 truncate text-[10px] uppercase tracking-[0.25em] text-white/30">
                    {track.subtitle}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-white/45">
                    {track.bpm} BPM
                  </p>

                  <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-white/25">
                    {active ? "Playing" : track.genre}
                  </p>
                </div>

                <span className="text-white/20 transition group-hover:translate-x-1 group-hover:text-white">
                  →
                </span>
              </button>
            );
          })}
        </div>

        <p className="absolute bottom-8 left-10 text-[9px] uppercase tracking-[0.4em] text-white/20">
          Navigate with ↑ ↓ or click a release
        </p>
      </aside>
    </div>
  );
}