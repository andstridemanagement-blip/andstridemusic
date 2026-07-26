"use client";

import { useEffect, useState } from "react";
import ContactModal from "../components/ContactModal";

export default function Home() {
  const [leaving, setLeaving] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  function enterSite() {
    if (leaving) return;

    setLeaving(true);

    window.setTimeout(() => {
      window.location.href = "/ride";
    }, 650);
  }

  useEffect(() => {
    fetch("/ride").catch(() => undefined);

    const video = document.createElement("video");
    video.preload = "auto";
    video.src = "/video/ride.mp4";

    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.key === "Enter" &&
        !contactOpen
      ) {
        enterSite();
      }

      if (event.key === "Escape") {
        setContactOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [contactOpen]);

  return (
    <main className="relative h-screen overflow-hidden bg-black text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
          leaving
            ? "scale-[1.08] opacity-0 blur-md"
            : "scale-100 opacity-100 blur-0"
        }`}
      >
        <source src="/video/ride.mp4" type="video/mp4" />
      </video>

      <div className="pointer-events-none absolute inset-0 bg-black/50" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(0,0,0,0.82)_100%)]" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/75" />

      {/* Header */}
      <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-7 py-7 md:px-12 md:py-9">
        <p className="text-[10px] uppercase tracking-[0.75em] text-white/45 md:text-xs">
          Andstride
        </p>

      <nav>
  <button
    type="button"
    onClick={() => setContactOpen(true)}
    className="text-[9px] uppercase tracking-[0.3em] text-white/35 transition hover:text-white md:text-[10px]"
  >
    Contact
  </button>
</nav>
      </header>

      {/* Hero */}
      <section
        className={`relative z-10 flex h-full flex-col items-center justify-center px-6 text-center transition-all duration-700 ${
          leaving
            ? "translate-y-5 scale-[0.98] opacity-0"
            : "translate-y-0 scale-100 opacity-100"
        }`}
      >
        <p className="text-[9px] uppercase tracking-[0.65em] text-white/35 sm:tracking-[0.9em] md:text-xs">
          Night Drives • Dark Sound
        </p>

        <h1 className="mt-8 text-[44px] font-black uppercase leading-none tracking-[0.15em] sm:text-[72px] sm:tracking-[0.2em] md:text-[126px]">
          Andstride
        </h1>

        <p className="mt-7 max-w-lg text-xs leading-6 text-white/30 md:text-sm">
          Atmospheric beats and cinematic instrumentals built for late
          nights.
        </p>

        <button
          type="button"
          onClick={enterSite}
          disabled={leaving}
          className="
            group
            mt-10
            flex
            items-center
            gap-5
            border
            border-white/20
            px-8
            py-4
            text-[10px]
            uppercase
            tracking-[0.45em]
            text-white/65
            transition-all
            duration-300
            hover:border-white
            hover:bg-white
            hover:text-black
            disabled:cursor-wait
          "
        >
          {leaving ? "Entering" : "Explore"}

          <span
            className={`transition-transform duration-300 ${
              leaving
                ? "translate-x-2"
                : "group-hover:translate-x-1"
            }`}
          >
            →
          </span>
        </button>

        <p className="mt-6 hidden text-[8px] uppercase tracking-[0.35em] text-white/20 md:block">
          Press Enter
        </p>
      </section>

      <footer className="absolute bottom-7 left-7 right-7 z-10 flex items-center justify-between md:bottom-8 md:left-12 md:right-12">
        <p className="text-[8px] uppercase tracking-[0.32em] text-white/20 md:text-[9px]">
          © Andstride • 2026
        </p>

        <p className="hidden text-[9px] uppercase tracking-[0.4em] text-white/20 md:block">
          Independent Producer
        </p>
      </footer>

      <div
        className={`pointer-events-none absolute inset-0 z-50 bg-black transition-opacity duration-700 ${
          leaving ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 z-[60] -translate-x-1/2 -translate-y-1/2 transition-all delay-300 duration-300 ${
          leaving
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0"
        }`}
      >
        <p className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.65em] text-white/45">
          Entering...
        </p>
      </div>

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </main>
  );
}