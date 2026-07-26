"use client";

import { useEffect, useState } from "react";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
};

const CONTACT_EMAIL = "andstridemanagement@gmail.com";

export default function ContactModal({
  open,
  onClose,
}: ContactModalProps) {
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
    <div className="fixed inset-0 z-[1100] flex items-center justify-center px-5 py-8">
      <button
        type="button"
        aria-label="Close contact window"
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      <section className="relative z-10 w-full max-w-xl border border-white/10 bg-[#080808]/95 p-7 shadow-[0_0_120px_rgba(0,0,0,0.9)] md:p-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/30">
              Contact
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase tracking-[0.08em] md:text-5xl">
              Let&apos;s Work
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

        <p className="mt-6 max-w-md text-sm leading-7 text-white/45">
          For beat purchases, custom production, placements, and business
          inquiries, reach out by email.
        </p>

        <div className="mt-9 border-y border-white/10 py-6">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/25">
            Business Email
          </p>

          <p className="mt-3 break-all text-lg text-white/85">
            {CONTACT_EMAIL}
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Beat Inquiry`}
            className="border border-white bg-white px-7 py-4 text-center text-[10px] uppercase tracking-[0.34em] text-black transition hover:bg-transparent hover:text-white"
          >
            Send Email
          </a>

          <button
            type="button"
            onClick={copyEmail}
            className="border border-white/15 px-7 py-4 text-[10px] uppercase tracking-[0.34em] text-white/55 transition hover:border-white/45 hover:text-white"
          >
            {copied ? "Email Copied" : "Copy Email"}
          </button>
        </div>

        <p className="mt-6 text-[9px] uppercase tracking-[0.3em] text-white/20">
          Response time: usually within 24–48 hours
        </p>
      </section>
    </div>
  );
}