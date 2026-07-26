"use client";

import { useEffect } from "react";

type SocialModalProps = {
  open: boolean;
  onClose: () => void;
};

const socials = [
  {
    name: "Instagram",
    handle: "@andstride",
    description: "Updates, previews, and visual content.",
    href: "https://www.instagram.com/andstride",
  },
  {
    name: "YouTube",
    handle: "@andstride",
    description: "Beats, releases, and music videos.",
    href: "https://www.youtube.com/@andstride",
  },
  {
    name: "SoundCloud",
    handle: "andstride",
    description: "Listen to tracks and new uploads.",
    href: "https://soundcloud.com/andstride",
  },
];

export default function SocialModal({
  open,
  onClose,
}: SocialModalProps) {
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
    <div className="fixed inset-0 z-[1250] flex items-center justify-center px-5 py-8">
      <button
        type="button"
        aria-label="Close social links"
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      <section className="relative z-10 w-full max-w-2xl border border-white/10 bg-[#080808]/95 p-7 shadow-[0_0_120px_rgba(0,0,0,0.9)] md:p-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[9px] uppercase tracking-[0.5em] text-white/30">
              Follow Andstride
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase tracking-[0.08em]">
              Socials
            </h2>

            <p className="mt-4 text-sm leading-6 text-white/35">
              Music, previews, updates, and new releases.
            </p>
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

        <div className="mt-9 border-t border-white/10">
          {socials.map((social, index) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-5 border-b border-white/10 py-6 transition hover:bg-white/[0.025]"
            >
              <span className="w-8 font-mono text-[8px] text-white/20">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <h3 className="text-lg font-semibold uppercase tracking-[0.08em] text-white/80 transition group-hover:text-white">
                    {social.name}
                  </h3>

                  <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                    {social.handle}
                  </p>
                </div>

                <p className="mt-2 text-sm text-white/35">
                  {social.description}
                </p>
              </div>

              <span className="text-white/25 transition group-hover:translate-x-1 group-hover:text-white">
                ↗
              </span>
            </a>
          ))}
        </div>

        <p className="mt-6 text-[8px] uppercase tracking-[0.3em] text-white/15">
          Links open in a new tab
        </p>
      </section>
    </div>
  );
}