"use client";

import { useEffect } from "react";

type AboutModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function AboutModal({
  open,
  onClose,
}: AboutModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center px-5 py-8">
      <button
        type="button"
        aria-label="Close about window"
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      <section className="relative z-10 w-full max-w-2xl border border-white/10 bg-[#080808]/95 p-7 shadow-[0_0_120px_rgba(0,0,0,0.9)] md:p-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[9px] uppercase tracking-[0.5em] text-white/30">
              About
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase tracking-[0.08em]">
              Andstride
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

        <p className="mt-7 max-w-xl text-sm leading-7 text-white/50">
          Andstride is an independent producer focused on atmospheric
          trap, dark textures, cinematic sound design, and late-night
          energy.
        </p>

        <p className="mt-4 max-w-xl text-sm leading-7 text-white/40">
          Available for beat licensing, custom production,
          collaborations, and artist placements.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-5 border-y border-white/10 py-6 sm:grid-cols-4">
          <div>
            <p className="text-[8px] uppercase tracking-[0.3em] text-white/25">
              Style
            </p>

            <p className="mt-2 text-sm text-white/70">
              Dark Trap
            </p>
          </div>

          <div>
            <p className="text-[8px] uppercase tracking-[0.3em] text-white/25">
              Based In
            </p>

            <p className="mt-2 text-sm text-white/70">
              Soon
            </p>
          </div>

          <div>
            <p className="text-[8px] uppercase tracking-[0.3em] text-white/25">
              Services
            </p>

            <p className="mt-2 text-sm text-white/70">
              Production
            </p>
          </div>

          <div>
            <p className="text-[8px] uppercase tracking-[0.3em] text-white/25">
              Status
            </p>

            <p className="mt-2 text-sm text-white/70">
              Available
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-7 border border-white/20 px-7 py-4 text-[9px] uppercase tracking-[0.34em] text-white/65 transition hover:border-white hover:bg-white hover:text-black"
        >
          Back to Music
        </button>
      </section>
    </div>
  );
}