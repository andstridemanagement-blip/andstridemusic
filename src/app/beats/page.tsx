"use client";

import BeatCatalog from "../../components/BeatCatalog";
import CursorFX from "../../components/CursorFX";
import { tracks } from "../../data/tracks";

export default function BeatsPage() {
  function returnHome() {
    window.location.href = "/";
  }

  function openPlayer() {
    window.location.href = `/ride?track=${tracks[0].slug}`;
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <CursorFX />

      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="fixed inset-0 h-full w-full scale-[1.08] object-cover opacity-35 blur-[2px]"
      >
        <source src="/video/ride.mp4" type="video/mp4" />
      </video>

      <div className="pointer-events-none fixed inset-0 bg-black/60" />

      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/90" />

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.75)_100%)]" />

      <header className="fixed left-0 right-0 top-0 z-50 flex h-20 items-center justify-between border-b border-white/[0.07] bg-black/30 px-6 backdrop-blur-xl md:px-12">
        <button
          type="button"
          onClick={returnHome}
          className="text-[9px] uppercase tracking-[0.7em] text-white/40 transition hover:text-white"
        >
          Andstride
        </button>

        <nav className="flex items-center gap-6">
          <button
            type="button"
            onClick={openPlayer}
            className="text-[8px] uppercase tracking-[0.28em] text-white/35 transition hover:text-white"
          >
            Player
          </button>

          <button
            type="button"
            onClick={returnHome}
            className="text-[8px] uppercase tracking-[0.28em] text-white/35 transition hover:text-white"
          >
            Home
          </button>
        </nav>
      </header>

      <BeatCatalog tracks={tracks} />
    </main>
  );
}