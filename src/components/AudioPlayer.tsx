"use client";

import {
  ChangeEvent,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { WAVEFORMS } from "../data/waveforms";

type AudioPlayerProps = {
  src: string;
  fallbackDuration: number;
  accent: string;
  onEnded?: () => void;
  onPlayingChange?: (playing: boolean) => void;
};

const DEFAULT_VOLUME = 0.8;

const FALLBACK_WAVEFORM = [
  0.18, 0.24, 0.31, 0.44, 0.38, 0.55, 0.7, 0.48,
  0.36, 0.59, 0.82, 0.66, 0.42, 0.75, 0.58, 0.88,
  0.69, 0.4, 0.77, 0.93, 0.62, 0.46, 0.73, 0.52,
  0.84, 0.68, 0.43, 0.79, 0.9, 0.57, 0.34, 0.64,
  0.86, 0.49, 0.71, 0.41, 0.81, 0.6, 0.95, 0.7,
  0.39, 0.76, 0.53, 0.87, 0.65, 0.45, 0.8, 0.97,
  0.61, 0.37, 0.72, 0.89, 0.5, 0.78, 0.56, 0.85,
  0.63, 0.42, 0.74, 0.91, 0.54, 0.32, 0.67, 0.83,
] as const;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

export default function AudioPlayer({
  src,
  fallbackDuration,
  accent,
  onEnded,
  onPlayingChange,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);

  const previousSrcRef = useRef(src);
  const volumeRef = useRef(DEFAULT_VOLUME);
  const mutedRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(fallbackDuration);
  const [dragging, setDragging] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [muted, setMuted] = useState(false);

  const waveform =
    WAVEFORMS[src] ??
    FALLBACK_WAVEFORM;

  const changePlaying = useCallback(
    (nextPlaying: boolean) => {
      setPlaying(nextPlaying);
      onPlayingChange?.(nextPlaying);
    },
    [onPlayingChange]
  );

  const applyAudioSettings = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = volumeRef.current;
    audio.muted = mutedRef.current;
  }, []);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;

    if (!audio) return;

    applyAudioSettings();

    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      console.error("Unable to play audio:", error);
    }
  }, [applyAudioSettings]);

  function updateDuration() {
    const audio = audioRef.current;

    if (!audio) return;

    if (
      Number.isFinite(audio.duration) &&
      audio.duration > 0
    ) {
      setDuration(audio.duration);
    }
  }

  function handleAudioReady() {
    applyAudioSettings();
    updateDuration();
  }

  function seekFromPointer(clientX: number) {
    const audio = audioRef.current;
    const waveformElement = waveformRef.current;

    if (
      !audio ||
      !waveformElement ||
      duration <= 0
    ) {
      return;
    }

    const rect =
      waveformElement.getBoundingClientRect();

    if (rect.width <= 0) return;

    const ratio = Math.min(
      Math.max(
        (clientX - rect.left) / rect.width,
        0
      ),
      1
    );

    const nextTime = ratio * duration;

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function handlePointerDown(
    event: ReactPointerEvent<HTMLDivElement>
  ) {
    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    setDragging(true);
    seekFromPointer(event.clientX);
  }

  function handlePointerMove(
    event: ReactPointerEvent<HTMLDivElement>
  ) {
    if (!dragging) return;

    seekFromPointer(event.clientX);
  }

  function handlePointerUp(
    event: ReactPointerEvent<HTMLDivElement>
  ) {
    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }

    setDragging(false);
    seekFromPointer(event.clientX);
  }

  function handleVolumeChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const nextVolume = Math.min(
      Math.max(Number(event.target.value), 0),
      1
    );

    volumeRef.current = nextVolume;
    setVolume(nextVolume);

    localStorage.setItem(
      "andstride-volume",
      String(nextVolume)
    );

    if (
      nextVolume > 0 &&
      mutedRef.current
    ) {
      mutedRef.current = false;
      setMuted(false);
    }

    applyAudioSettings();
  }

  function toggleMute() {
    const nextMuted = !mutedRef.current;

    mutedRef.current = nextMuted;
    setMuted(nextMuted);

    applyAudioSettings();
  }

  function handleEnded() {
    const audio = audioRef.current;

    changePlaying(false);
    setCurrentTime(0);

    if (audio) {
      audio.currentTime = 0;
    }

    onEnded?.();
  }

  useEffect(() => {
    const savedVolumeRaw =
      localStorage.getItem("andstride-volume");

    const savedVolume =
      savedVolumeRaw === null
        ? DEFAULT_VOLUME
        : Number(savedVolumeRaw);

    const initialVolume =
      Number.isFinite(savedVolume)
        ? Math.min(Math.max(savedVolume, 0), 1)
        : DEFAULT_VOLUME;

    volumeRef.current = initialVolume;
    mutedRef.current = false;

    setVolume(initialVolume);
    setMuted(false);

    applyAudioSettings();
  }, [applyAudioSettings]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const sourceActuallyChanged =
      previousSrcRef.current !== src;

    if (!sourceActuallyChanged) {
      applyAudioSettings();
      return;
    }

    previousSrcRef.current = src;

    audio.pause();
    audio.currentTime = 0;

    applyAudioSettings();

    changePlaying(false);
    setCurrentTime(0);
    setDuration(fallbackDuration);
    setDragging(false);
  }, [
    src,
    fallbackDuration,
    applyAudioSettings,
    changePlaying,
  ]);

  useEffect(() => {
    volumeRef.current = volume;
    mutedRef.current = muted;

    applyAudioSettings();
  }, [
    volume,
    muted,
    applyAudioSettings,
  ]);

  useEffect(() => {
    function handleKeyboard(event: KeyboardEvent) {
      if (event.code !== "Space") return;

      const target =
        event.target as HTMLElement | null;

      const tagName =
        target?.tagName.toLowerCase();

      if (
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "button" ||
        tagName === "a" ||
        target?.isContentEditable
      ) {
        return;
      }

      event.preventDefault();
      void togglePlay();
    }

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, [togglePlay]);

  const safeDuration =
    Number.isFinite(duration) &&
    duration > 0
      ? duration
      : fallbackDuration;

  const progressRatio =
    safeDuration > 0
      ? Math.min(
          Math.max(
            currentTime / safeDuration,
            0
          ),
          1
        )
      : 0;

  const progressPercent =
    progressRatio * 100;

  const ringBackground = `conic-gradient(
    ${accent} 0%,
    ${accent} ${progressPercent}%,
    rgba(255,255,255,0.1) ${progressPercent}%,
    rgba(255,255,255,0.1) 100%
  )`;

  return (
    <div className="w-full">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={handleAudioReady}
        onLoadedData={handleAudioReady}
        onCanPlay={handleAudioReady}
        onDurationChange={handleAudioReady}
        onTimeUpdate={(event) => {
          if (!dragging) {
            setCurrentTime(
              event.currentTarget.currentTime
            );
          }
        }}
        onPlay={() => changePlaying(true)}
        onPause={() => changePlaying(false)}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => void togglePlay()}
          aria-label={
            playing
              ? "Pause track"
              : "Play track"
          }
          className="
            relative
            z-20
            flex
            h-10
            w-12
            shrink-0
            items-center
            justify-center
            rounded-full
            transition-transform
            duration-300
            hover:scale-105
          "
          style={{
            background: ringBackground,
            boxShadow: playing
              ? `0 0 32px ${accent}35`
              : "none",
          }}
        >
          <span className="pointer-events-none absolute inset-[2px] rounded-full bg-black/90" />

          <span className="pointer-events-none relative z-10 text-[12px] text-white">
            {playing ? "Ⅱ" : "▶"}
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <div
            ref={waveformRef}
            role="slider"
            aria-label="Track position"
            aria-valuemin={0}
            aria-valuemax={safeDuration}
            aria-valuenow={currentTime}
            tabIndex={0}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={() =>
              setDragging(false)
            }
            className="
              relative
              flex
              h-12
              w-full
              touch-none
              cursor-pointer
              items-center
              justify-between
              overflow-hidden
            "
          >
            {waveform.map((peak, index) => {
              const barPosition =
                waveform.length > 1
                  ? index /
                    (waveform.length - 1)
                  : 0;

              const played =
                barPosition <= progressRatio;

              const visualPeak = Math.max(
                0.08,
                Math.min(1, peak)
              );

              const height = Math.round(
                5 + visualPeak * 28
              );

              return (
                <span
                  key={`${src}-${index}`}
                  className="
                    block
                    w-px
                    shrink-0
                    rounded-full
                    transition-[height,opacity,background-color,box-shadow]
                    duration-150
                  "
                  style={{
                    height: `${height}px`,
                    backgroundColor: played
                      ? accent
                      : "rgba(255,255,255,0.22)",
                    opacity: played
                      ? playing
                        ? 1
                        : 0.78
                      : 0.72,
                    boxShadow:
                      played && playing
                        ? `0 0 5px ${accent}`
                        : "none",
                  }}
                />
              );
            })}
          </div>

          <div className="mt-1 flex justify-between font-mono text-[8px] text-white/30">
            <span>
              {formatTime(currentTime)}
            </span>

            <span>
              {formatTime(safeDuration)}
            </span>
          </div>
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <button
            type="button"
            onClick={toggleMute}
            aria-label={
              muted
                ? "Unmute audio"
                : "Mute audio"
            }
            className="
              w-12
              shrink-0
              text-left
              text-[8px]
              uppercase
              tracking-[0.15em]
              text-white/35
              transition
              hover:text-white
            "
          >
            {muted || volume === 0
              ? "Mute"
              : "Vol"}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={handleVolumeChange}
            aria-label="Volume"
            className="volume-range w-20 shrink-0 cursor-pointer"
          />
        </div>
      </div>

      <p className="mt-2 hidden text-[7px] uppercase tracking-[0.24em] text-white/12 md:block">
        Space to play or pause
      </p>
    </div>
  );
}