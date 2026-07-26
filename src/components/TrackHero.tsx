"use client";

import AudioPlayer from "./AudioPlayer";
import type { Track } from "../data/tracks";

type TrackHeroProps = {
  track: Track;
  trackIndex: number;
  visible: boolean;
  playing: boolean;
  parallaxX?: number;
  parallaxY?: number;
  onBuy: () => void;
  onEnded: () => void;
  onListen: () => void | Promise<void>;
  onPlayingChange: (playing: boolean) => void;
};

const AVAILABILITY = {
  available: {
    label: "Exclusive Available",
    button: "Request License",
    color: "#a7f3d0",
  },
  reserved: {
    label: "Exclusive Reserved",
    button: "Reserved",
    color: "#fbbf24",
  },
  sold: {
    label: "Exclusive Sold",
    button: "Sold",
    color: "#fb7185",
  },
  coming: {
    label: "Coming Soon",
    button: "Not Available",
    color: "#7dd3fc",
  },
} as const;

export default function TrackHero({
  track,
  trackIndex,
  visible,
  playing,
  parallaxX = 0,
  parallaxY = 0,
  onBuy,
  onEnded,
  onListen,
  onPlayingChange,
}: TrackHeroProps) {
  const state = AVAILABILITY[track.availability];
  const sold = track.availability === "sold";
  const available = track.availability === "available";

  return (
    <section
      className={`absolute bottom-16 left-10 top-20 z-20 flex w-[500px] max-w-[calc(100%-5rem)] flex-col justify-center transition-[opacity,filter] duration-500 md:left-12 ${
        visible
          ? "opacity-100 blur-0"
          : "pointer-events-none opacity-0 blur-sm"
      } ${sold ? "saturate-[0.88]" : ""}`}
      style={{
        transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0)`,
        transition:
          "opacity 500ms ease, filter 500ms ease, transform 220ms ease-out",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor: sold ? state.color : track.accent,
            boxShadow: `0 0 14px ${
              sold ? state.color : track.accent
            }`,
          }}
        />

        <p className="text-[8px] uppercase tracking-[0.45em] text-white/30">
          Release {String(trackIndex + 1).padStart(3, "0")}
        </p>
      </div>

      <div className="flex items-end gap-4">
        <h1
          className="mt-5 text-[46px] font-black uppercase leading-[0.9] tracking-[0.08em] sm:text-[60px] md:text-[72px]"
          style={{
            textShadow: `0 0 ${
              playing ? "62px" : "40px"
            } ${track.accent}${playing ? "45" : "25"}`,
            transition: "text-shadow 600ms ease",
          }}
        >
          {track.title}
        </h1>

        {sold && (
          <span className="mb-1 border border-rose-300/25 bg-rose-300/[0.04] px-2.5 py-1 text-[7px] uppercase tracking-[0.32em] text-rose-200/75">
            Sold
          </span>
        )}
      </div>

      <p className="mt-5 text-[8px] uppercase tracking-[0.34em] text-white/35 md:text-[9px]">
        {track.subtitle}
      </p>

      <p className="mt-4 max-w-md text-[11px] italic leading-6 text-white/30">
        “{track.quote}”
      </p>

      <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 border-y border-white/10 py-4 sm:grid-cols-4 sm:gap-5">
        <div>
          <p className="text-[7px] uppercase tracking-[0.28em] text-white/20">
            BPM
          </p>
          <p className="mt-2 text-xs text-white/65">
            {track.bpm}
          </p>
        </div>

        <div>
          <p className="text-[7px] uppercase tracking-[0.28em] text-white/20">
            Key
          </p>
          <p className="mt-2 text-xs text-white/65">
            {track.musicalKey}
          </p>
        </div>

        <div>
          <p className="text-[7px] uppercase tracking-[0.28em] text-white/20">
            Genre
          </p>
          <p className="mt-2 text-xs text-white/65">
            {track.genre}
          </p>
        </div>

        <div>
          <p className="text-[7px] uppercase tracking-[0.28em] text-white/20">
            Format
          </p>
          <p className="mt-2 text-xs text-white/65">
            {track.format}
          </p>
        </div>
      </div>

      <div
        className={`mt-5 max-w-[490px] ${
          sold ? "opacity-80" : ""
        }`}
      >
        <AudioPlayer
          key={track.audio}
          src={track.audio}
          fallbackDuration={track.duration}
          accent={track.accent}
          onEnded={onEnded}
          onPlayingChange={(nextPlaying) => {
            onPlayingChange(nextPlaying);

            if (nextPlaying) {
              void onListen();
            }
          }}
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="relative flex h-1.5 w-1.5">
          {track.availability !== "coming" && (
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-25 [animation-duration:3s]"
              style={{
                backgroundColor: state.color,
              }}
            />
          )}

          <span
            className="relative h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor:
                track.availability === "coming"
                  ? "transparent"
                  : state.color,
              border:
                track.availability === "coming"
                  ? `1px solid ${state.color}`
                  : undefined,
              boxShadow: `0 0 10px ${state.color}`,
            }}
          />
        </span>

        <p
          className="text-[7px] uppercase tracking-[0.3em]"
          style={{
            color: `${state.color}B8`,
          }}
        >
          {state.label}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={onBuy}
          className={`group flex min-w-[170px] items-center justify-center gap-3 whitespace-nowrap border px-5 py-3 text-[7px] uppercase tracking-[0.2em] transition duration-300 ${
            available
              ? "border-white/15 text-white/60 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-black"
              : sold
                ? "border-rose-400/25 bg-rose-400/[0.045] text-rose-200/75 hover:border-rose-300/45"
                : "border-white/15 bg-white/[0.025] text-white/45 hover:border-white/30"
          }`}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: state.color,
              boxShadow: `0 0 9px ${state.color}`,
            }}
          />

          {state.button}
        </button>

        <a
          href={track.audio}
          download={track.downloadName}
          className="flex items-center gap-3 whitespace-nowrap px-4 py-3 text-[7px] uppercase tracking-[0.2em] text-white/30 transition duration-300 hover:-translate-y-0.5 hover:text-white"
        >
          <span className="text-white/20">↓</span>
          Download
        </a>
      </div>
    </section>
  );
}