"use client";

import type { RefObject } from "react";

type RideHeaderProps = {
  visible: boolean;
  moreOpen: boolean;
  fullscreen: boolean;
  shareCopied: boolean;

  moreMenuRef: RefObject<HTMLDivElement | null>;

  onHome: () => void;
  onTracks: () => void;
  onAbout: () => void;
  onConnect: () => void;
  onMap: () => void;
  onWork: () => void;
  onToggleMore: () => void;
  onShare: () => void;
  onFullscreen: () => void;
};

export default function RideHeader({
  visible,
  moreOpen,
  fullscreen,
  shareCopied,
  moreMenuRef,
  onHome,
  onTracks,
  onAbout,
  onConnect,
  onMap,
  onWork,
  onToggleMore,
  onShare,
  onFullscreen,
}: RideHeaderProps) {
  return (
    <header
      className={`absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-8 py-7 transition-all duration-700 md:px-12 ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-4 opacity-0"
      }`}
    >
      <button
        type="button"
        onClick={onHome}
        className="text-[9px] uppercase tracking-[0.7em] text-white/40 transition hover:text-white"
      >
        Andstride
      </button>

      <nav className="flex items-center gap-4 sm:gap-6 md:gap-7">
        <button
          type="button"
          onClick={onTracks}
          className="text-[9px] uppercase tracking-[0.24em] text-white/35 transition hover:text-white"
        >
          Archive
        </button>

        <button
          type="button"
          onClick={onAbout}
          className="hidden text-[9px] uppercase tracking-[0.24em] text-white/35 transition hover:text-white sm:block"
        >
          About
        </button>

        <button
          type="button"
          onClick={onConnect}
          className="text-[9px] uppercase tracking-[0.24em] text-white/35 transition hover:text-white"
        >
          Connect
        </button>

        <div ref={moreMenuRef} className="relative">
          <button
            type="button"
            onClick={onToggleMore}
            aria-label="More options"
            aria-expanded={moreOpen}
            className="flex h-7 w-8 items-center justify-center text-sm tracking-[0.2em] text-white/35 transition hover:text-white"
          >
            •••
          </button>

          <div
            className={`absolute right-0 top-9 w-52 border border-white/10 bg-black/85 p-2 backdrop-blur-xl transition-all duration-200 ${
              moreOpen
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-2 opacity-0"
            }`}
          >
            <button
              type="button"
              onClick={onWork}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-[8px] uppercase tracking-[0.25em] text-white/35 transition hover:bg-white/[0.05] hover:text-white"
            >
              Discography
             
            </button>

            <button
              type="button"
              onClick={onMap}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-[8px] uppercase tracking-[0.25em] text-white/35 transition hover:bg-white/[0.05] hover:text-white"
            >
              Listener Log

              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white/70" />
              </span>
            </button>

            <button
              type="button"
              onClick={onShare}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-[8px] uppercase tracking-[0.25em] text-white/35 transition hover:bg-white/[0.05] hover:text-white"
            >
              {shareCopied ? "Link Copied" : "Share Track"}
              <span>↗</span>
            </button>

            <button
              type="button"
              onClick={onFullscreen}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-[8px] uppercase tracking-[0.25em] text-white/35 transition hover:bg-white/[0.05] hover:text-white"
            >
              {fullscreen ? "Exit Fullscreen" : "Fullscreen"}
              <span>↗</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}