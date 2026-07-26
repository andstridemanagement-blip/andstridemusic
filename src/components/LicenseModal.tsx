"use client";

import { useEffect, useMemo, useState } from "react";
import type { Track } from "../data/tracks";

type LicenseModalProps = {
  open: boolean;
  trackTitle: string;
  trackAvailability?: Track["availability"];
  onClose: () => void;
};

type LicenseType =
  | "MP3 Lease"
  | "WAV Lease"
  | "Unlimited License"
  | "Exclusive Rights";

const CONTACT_EMAIL = "andstridemanagement@gmail.com";

const licenses: Array<{
  name: LicenseType;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}> = [
  {
    name: "MP3 Lease",
    price: "$30",
    description: "Entry-level license for independent releases.",
    features: [
      "Tagged MP3 file",
      "Commercial release",
      "Producer credit required",
      "Non-exclusive usage",
    ],
  },
  {
    name: "WAV Lease",
    price: "$50",
    description: "High-quality file for professional recording.",
    features: [
      "Untagged WAV file",
      "Commercial release",
      "Producer credit required",
      "Non-exclusive usage",
    ],
    highlighted: true,
  },
  {
    name: "Unlimited License",
    price: "$100",
    description: "Extended usage for serious releases.",
    features: [
      "Untagged WAV file",
      "Unlimited streams",
      "Music video usage",
      "Non-exclusive usage",
    ],
  },
  {
    name: "Exclusive Rights",
    price: "$300",
    description: "The beat is removed from future licensing.",
    features: [
      "Full-quality files",
      "Exclusive usage",
      "Beat removed from catalog",
      "Terms confirmed individually",
    ],
  },
];

const unavailableCopy = {
  sold: {
    eyebrow: "License Request",
    heading: "Sold",
    description:
      "Exclusive rights for this production have already been acquired. The preview remains available for listening.",
    color: "#fb7185",
  },
  reserved: {
    eyebrow: "License Request",
    heading: "Reserved",
    description:
      "This production is currently being held for an artist. Licensing may reopen later.",
    color: "#fbbf24",
  },
  coming: {
    eyebrow: "License Request",
    heading: "Coming Soon",
    description:
      "Licensing for this production has not opened yet.",
    color: "#7dd3fc",
  },
} as const;

export default function LicenseModal({
  open,
  trackTitle,
  trackAvailability = "available",
  onClose,
}: LicenseModalProps) {
  const [selectedLicense, setSelectedLicense] =
    useState<LicenseType>("WAV Lease");

  const selectedOption = useMemo(
    () =>
      licenses.find((license) => license.name === selectedLicense) ??
      licenses[1],
    [selectedLicense]
  );

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  if (trackAvailability !== "available") {
    const copy = unavailableCopy[trackAvailability];

    return (
      <div className="fixed inset-0 z-[1300] flex items-center justify-center px-4 py-6">
        <button
          type="button"
          aria-label="Close license request"
          onClick={onClose}
          className="absolute inset-0 bg-black/92 backdrop-blur-md"
        />

        <section className="relative z-10 flex min-h-[520px] w-full max-w-3xl flex-col overflow-hidden border border-white/10 bg-[#070707]/97 shadow-[0_0_140px_rgba(0,0,0,0.95)]">
          <header className="relative flex items-start justify-between border-b border-white/10 px-6 py-6 md:px-9">
            <div>
              <p className="text-[8px] uppercase tracking-[0.5em] text-white/25">
                {copy.eyebrow}
              </p>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.12em] text-white/60">
                {trackTitle}
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
          </header>

          <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-14 text-center">
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  trackAvailability === "coming" ? "transparent" : copy.color,
                border:
                  trackAvailability === "coming"
                    ? `1px solid ${copy.color}`
                    : undefined,
                boxShadow: `0 0 18px ${copy.color}`,
              }}
            />

            <h2
              className="mt-8 text-[clamp(4rem,12vw,9rem)] font-black uppercase leading-none tracking-[0.08em]"
              style={{
                color: copy.color,
                textShadow: `0 0 48px ${copy.color}28`,
              }}
            >
              {copy.heading}
            </h2>

            <div
              className="mt-7 h-px w-24"
              style={{
                background: `linear-gradient(90deg, transparent, ${copy.color}, transparent)`,
              }}
            />

            <p className="mt-8 max-w-xl text-[10px] uppercase leading-7 tracking-[0.22em] text-white/32">
              {copy.description}
            </p>
          </div>

          <footer className="relative flex items-center justify-between border-t border-white/10 px-6 py-5 md:px-9">
            <p className="text-[7px] uppercase tracking-[0.34em] text-white/18">
              Andstride licensing
            </p>

            <button
              type="button"
              onClick={onClose}
              className="border border-white/10 px-6 py-3 text-[8px] uppercase tracking-[0.3em] text-white/35 transition hover:border-white/35 hover:text-white"
            >
              Continue Listening
            </button>
          </footer>
        </section>
      </div>
    );
  }

  const subject = encodeURIComponent(
    `${selectedLicense} inquiry — ${trackTitle}`
  );

  const body = encodeURIComponent(
    [
      "Hi Andstride,",
      "",
      `I'm interested in the "${trackTitle}" beat.`,
      `License: ${selectedOption.name}`,
      `Price: ${selectedOption.price}`,
      "",
      "Please send me the payment details and full license terms.",
      "",
      "Artist name:",
      "Release type:",
      "Planned release date:",
    ].join("\n")
  );

  const emailHref =
    `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Close license request"
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />

      <section className="relative z-10 max-h-[92vh] w-full max-w-5xl overflow-y-auto border border-white/10 bg-[#070707]/95 shadow-[0_0_140px_rgba(0,0,0,0.95)]">
        <header className="sticky top-0 z-20 flex items-start justify-between gap-6 border-b border-white/10 bg-[#070707]/95 px-6 py-6 backdrop-blur-xl md:px-9">
          <div>
            <p className="text-[8px] uppercase tracking-[0.5em] text-white/25">
              License Request
            </p>

            <h2 className="mt-3 text-3xl font-black uppercase tracking-[0.08em] md:text-4xl">
              {trackTitle}
            </h2>

            <p className="mt-3 text-xs leading-6 text-white/35">
              Choose a license option and submit a request.
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
        </header>

        <div className="grid gap-3 p-5 md:grid-cols-2 md:p-7 xl:grid-cols-4">
          {licenses.map((license) => {
            const active = selectedLicense === license.name;

            return (
              <button
                key={license.name}
                type="button"
                onClick={() => setSelectedLicense(license.name)}
                className={`relative grid min-h-[360px] grid-rows-[auto_58px_38px_66px_1fr_auto] border p-5 text-left transition duration-300 hover:-translate-y-1 ${
                  active
                    ? "border-white/35 bg-white/[0.07]"
                    : "border-white/[0.08] bg-white/[0.015] hover:border-white/20 hover:bg-white/[0.035]"
                }`}
              >
                {license.highlighted && (
                  <span className="absolute right-4 top-4 text-[7px] uppercase tracking-[0.28em] text-white/30">
                    Recommended
                  </span>
                )}

                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    active
                      ? "bg-white shadow-[0_0_12px_white]"
                      : "bg-white/20"
                  }`}
                />

                <h3 className="flex items-start pt-5 text-lg font-bold uppercase leading-[1.35] tracking-[0.08em] text-white/85">
                  {license.name}
                </h3>

                <p className="flex items-center text-2xl font-black text-white">
                  {license.price}
                </p>

                <p className="pt-2 text-xs leading-6 text-white/35">
                  {license.description}
                </p>

                <div className="space-y-3 border-t border-white/[0.08] pt-5">
                  {license.features.map((feature) => (
                    <p
                      key={feature}
                      className="flex items-start gap-3 text-[10px] leading-5 text-white/40"
                    >
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-white/35" />
                      {feature}
                    </p>
                  ))}
                </div>

                <p className="pt-5 text-[8px] uppercase tracking-[0.3em] text-white/40">
                  {active ? "Selected" : "Select"}
                </p>
              </button>
            );
          })}
        </div>

        <footer className="sticky bottom-0 z-20 flex flex-col gap-5 border-t border-white/10 bg-[#070707]/95 px-6 py-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between md:px-9">
          <div>
            <p className="text-[8px] uppercase tracking-[0.35em] text-white/20">
              Selected License
            </p>

            <div className="mt-2 flex items-baseline gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-white/70">
                {selectedOption.name}
              </p>
              <p className="text-lg font-black text-white">
                {selectedOption.price}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="border border-white/10 px-6 py-3 text-[8px] uppercase tracking-[0.3em] text-white/35 transition hover:border-white/30 hover:text-white"
            >
              Continue Listening
            </button>

            <a
              href={emailHref}
              className="border border-white bg-white px-6 py-3 text-center text-[8px] uppercase tracking-[0.3em] text-black transition hover:bg-transparent hover:text-white"
            >
              Request License — {selectedOption.price}
            </a>
          </div>
        </footer>
      </section>
    </div>
  );
}