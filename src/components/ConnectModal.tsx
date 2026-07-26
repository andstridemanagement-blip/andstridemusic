"use client";

import { useEffect, useState } from "react";

type ConnectModalProps = {
  open: boolean;
  onClose: () => void;
};

const CONTACT_EMAIL = "andstridemanagement@gmail.com";

const socials = [
  {
    name: "Instagram",
    handle: "@andstride",
    href: "https://www.instagram.com/andstride",
  },
  {
    name: "YouTube",
    handle: "@andstride",
    href: "https://www.youtube.com/@andstride",
  },
  {
    name: "SoundCloud",
    handle: "andstride",
    href: "https://soundcloud.com/andstride",
  },
];

export default function ConnectModal({
  open,
  onClose,
}: ConnectModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setCopied(false);
      return;
    }

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

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1250] flex items-center justify-center px-5 py-8">
      <button
        type="button"
        aria-label="Close connect window"
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      <section className="relative z-10 w-full max-w-2xl border border-white/10 bg-[#080808]/95 p-7 shadow-[0_0_120px_rgba(0,0,0,0.9)] md:p-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[9px] uppercase tracking-[0.5em] text-white/25">
              Business & Social
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase tracking-[0.08em] md:text-5xl">
              Connect
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-white/35">
              For beat licensing, custom production, collaborations,
              placements, and business inquiries.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-3xl leading-none text-white/30 transition hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="mt-8 border-y border-white/10 py-6">
          <p className="text-[8px] uppercase tracking-[0.4em] text-white/20">
            Business Email
          </p>

          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="break-all text-base text-white/75">
              {CONTACT_EMAIL}
            </p>

            <div className="flex shrink-0 gap-3">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Beat Inquiry`}
                className="border border-white bg-white px-5 py-3 text-[8px] uppercase tracking-[0.3em] text-black transition hover:bg-transparent hover:text-white"
              >
                Email
              </a>

              <button
                type="button"
                onClick={copyEmail}
                className="border border-white/15 px-5 py-3 text-[8px] uppercase tracking-[0.3em] text-white/45 transition hover:border-white/40 hover:text-white"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-white/10">
          {socials.map((social, index) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-5 border-b border-white/[0.07] py-5 transition last:border-b-0 hover:bg-white/[0.025]"
            >
              <span className="w-7 font-mono text-[8px] text-white/15">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-white/65 transition group-hover:text-white">
                  {social.name}
                </p>

                <p className="mt-2 text-[8px] uppercase tracking-[0.25em] text-white/20">
                  {social.handle}
                </p>
              </div>

              <span className="text-white/20 transition group-hover:translate-x-1 group-hover:text-white">
                ↗
              </span>
            </a>
          ))}
        </div>

        <p className="mt-6 text-[8px] uppercase tracking-[0.3em] text-white/15">
          Usually replies within 24–48 hours
        </p>
      </section>
    </div>
  );
}