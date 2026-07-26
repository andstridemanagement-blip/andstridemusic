"use client";

import { useEffect, useMemo, useState } from "react";

type ListenEvent = {
  id: number;
  track_slug: string;
  track_title: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  created_at: string;
};

type SignalFeedProps = {
  events: ListenEvent[];
  onSelectEvent: (event: ListenEvent) => void;
};

const MAX_VISIBLE_EVENTS = 20;

function cleanLocationPart(value: string | null | undefined) {
  const trimmed = value?.trim();

  if (
    !trimmed ||
    trimmed.toLowerCase() === "unknown" ||
    trimmed.toLowerCase() === "undefined" ||
    trimmed.toLowerCase() === "null"
  ) {
    return null;
  }

  return trimmed;
}

function formatLocation(event: ListenEvent) {
  const city = cleanLocationPart(event.city);
  const country = cleanLocationPart(event.country);

  if (city && country) {
    return `${city}, ${country}`;
  }

  if (city) {
    return city;
  }

  if (country) {
    return country;
  }

  return "Unknown signal";
}

function formatRelativeTime(
  createdAt: string,
  currentTime: number
) {
  const createdTime = new Date(createdAt).getTime();

  if (!Number.isFinite(createdTime)) {
    return "Unknown time";
  }

  const differenceSeconds = Math.max(
    0,
    Math.floor((currentTime - createdTime) / 1000)
  );

  if (differenceSeconds < 10) {
    return "Just now";
  }

  if (differenceSeconds < 60) {
    return `${differenceSeconds}s ago`;
  }

  const differenceMinutes = Math.floor(
    differenceSeconds / 60
  );

  if (differenceMinutes < 60) {
    return `${differenceMinutes}m ago`;
  }

  const differenceHours = Math.floor(
    differenceMinutes / 60
  );

  if (differenceHours < 24) {
    return `${differenceHours}h ago`;
  }

  const differenceDays = Math.floor(
    differenceHours / 24
  );

  if (differenceDays < 30) {
    return `${differenceDays}d ago`;
  }

  return new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function normalizeTrackTitle(trackTitle: string) {
  return trackTitle?.trim() || "Unknown track";
}

function SignalPulse({
  active,
  delay,
}: {
  active: boolean;
  delay: number;
}) {
  return (
    <span className="relative flex h-3 w-3 shrink-0 items-center justify-center">
      {active && (
        <span
          className="absolute h-full w-full animate-ping rounded-full bg-white/25"
          style={{
            animationDelay: `${delay}ms`,
            animationDuration: "2.4s",
          }}
        />
      )}

      <span
        className={`relative h-1.5 w-1.5 rounded-full transition ${
          active
            ? "bg-white shadow-[0_0_14px_rgba(255,255,255,0.95)]"
            : "bg-white/25"
        }`}
      />
    </span>
  );
}

export default function SignalFeed({
  events,
  onSelectEvent,
}: SignalFeedProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(Date.now());

    const interval = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 10_000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const sortedEvents = useMemo(() => {
    return [...events]
      .filter((event) => {
        return (
          typeof event.id === "number" &&
          Boolean(event.track_title) &&
          Boolean(event.created_at)
        );
      })
      .sort((firstEvent, secondEvent) => {
        const firstTime = new Date(
          firstEvent.created_at
        ).getTime();

        const secondTime = new Date(
          secondEvent.created_at
        ).getTime();

        return secondTime - firstTime;
      })
      .slice(0, MAX_VISIBLE_EVENTS);
  }, [events]);

  const latestEvent = sortedEvents[0] ?? null;

  const signalsLastThirtyDays = useMemo(() => {
    const now = currentTime || Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const threshold = now - thirtyDays;

    return events.filter((event) => {
      const createdTime = new Date(
        event.created_at
      ).getTime();

      return (
        Number.isFinite(createdTime) &&
        createdTime >= threshold
      );
    }).length;
  }, [events, currentTime]);

  return (
    <section className="relative overflow-hidden border border-white/[0.08] bg-[#030405]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.05),transparent_36%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:42px_42px]" />

      <header className="relative border-b border-white/[0.08] px-5 py-5 md:px-8 md:py-7">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white shadow-[0_0_12px_white]" />
              </span>

              <p className="text-[8px] font-medium uppercase tracking-[0.45em] text-white/35">
                Live transmission
              </p>
            </div>

            <h2 className="mt-4 text-2xl font-black uppercase tracking-[0.09em] text-white md:text-4xl">
              Signal Feed
            </h2>

            <p className="mt-3 max-w-xl text-[10px] uppercase tracking-[0.22em] text-white/25">
              Recent listening activity detected across the network
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden border border-white/[0.08] bg-white/[0.08]">
            <div className="min-w-[130px] bg-[#050607] px-5 py-4">
              <p className="text-[7px] uppercase tracking-[0.34em] text-white/20">
                Signals / 30d
              </p>

              <p className="mt-2 font-mono text-xl text-white/80">
                {String(signalsLastThirtyDays).padStart(
                  3,
                  "0"
                )}
              </p>
            </div>

            <div className="min-w-[130px] bg-[#050607] px-5 py-4">
              <p className="text-[7px] uppercase tracking-[0.34em] text-white/20">
                Connection
              </p>

              <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/70">
                {events.length > 0 ? "Active" : "Standby"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {latestEvent && (
        <div className="relative border-b border-white/[0.08] bg-white/[0.025] px-5 py-5 md:px-8">
          <p className="text-[7px] uppercase tracking-[0.38em] text-white/20">
            Latest signal
          </p>

          <button
            type="button"
            onClick={() => onSelectEvent(latestEvent)}
            className="group mt-4 flex w-full flex-col gap-4 text-left md:flex-row md:items-center md:justify-between"
          >
            <div className="flex min-w-0 items-center gap-4">
              <SignalPulse active delay={0} />

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold uppercase tracking-[0.1em] text-white/85 transition group-hover:text-white md:text-base">
                  {formatLocation(latestEvent)}
                </p>

                <p className="mt-1 truncate text-[8px] uppercase tracking-[0.3em] text-white/25">
                  Signal successfully received
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 pl-7 md:pl-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/55">
                {normalizeTrackTitle(
                  latestEvent.track_title
                )}
              </p>

              <p className="whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.12em] text-white/25">
                {mounted
                  ? formatRelativeTime(
                      latestEvent.created_at,
                      currentTime
                    )
                  : "Connecting"}
              </p>

              <span className="text-white/20 transition group-hover:translate-x-1 group-hover:text-white">
                →
              </span>
            </div>
          </button>
        </div>
      )}

      <div className="relative">
        <div className="hidden grid-cols-[54px_minmax(180px,1.4fr)_minmax(140px,1fr)_110px_32px] border-b border-white/[0.08] px-5 py-3 text-[7px] uppercase tracking-[0.34em] text-white/18 md:grid md:px-8">
          <span>ID</span>
          <span>Location</span>
          <span>Track accessed</span>
          <span>Received</span>
          <span />
        </div>

        {sortedEvents.length > 0 ? (
          <div>
            {sortedEvents.map((event, index) => {
              const isNewest = index === 0;

              return (
                <button
                  key={`${event.id}-${event.created_at}`}
                  type="button"
                  onClick={() => onSelectEvent(event)}
                  className="group grid w-full grid-cols-[38px_minmax(0,1fr)_24px] items-center gap-3 border-b border-white/[0.055] px-5 py-4 text-left transition duration-300 hover:bg-white/[0.035] md:grid-cols-[54px_minmax(180px,1.4fr)_minmax(140px,1fr)_110px_32px] md:gap-0 md:px-8"
                >
                  <div className="flex items-center gap-3">
                    <SignalPulse
                      active={isNewest}
                      delay={index * 140}
                    />

                    <span className="hidden font-mono text-[8px] text-white/18 md:inline">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-white/62 transition group-hover:text-white">
                      {formatLocation(event)}
                    </p>

                    <p className="mt-1 truncate text-[7px] uppercase tracking-[0.25em] text-white/18 md:hidden">
                      {normalizeTrackTitle(event.track_title)}
                      {" · "}
                      {mounted
                        ? formatRelativeTime(
                            event.created_at,
                            currentTime
                          )
                        : "Connecting"}
                    </p>
                  </div>

                  <p className="hidden truncate text-[9px] uppercase tracking-[0.2em] text-white/35 transition group-hover:text-white/70 md:block">
                    {normalizeTrackTitle(event.track_title)}
                  </p>

                  <p className="hidden whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.1em] text-white/20 md:block">
                    {mounted
                      ? formatRelativeTime(
                          event.created_at,
                          currentTime
                        )
                      : "Connecting"}
                  </p>

                  <span className="text-right text-white/15 transition duration-300 group-hover:translate-x-1 group-hover:text-white">
                    →
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/15" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-white/20" />
            </span>

            <p className="mt-6 text-[9px] font-semibold uppercase tracking-[0.32em] text-white/35">
              Awaiting signal
            </p>

            <p className="mt-3 text-[8px] uppercase tracking-[0.24em] text-white/15">
              Listening activity will appear here
            </p>
          </div>
        )}
      </div>

      <footer className="relative flex flex-col gap-3 border-t border-white/[0.08] px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="text-[7px] uppercase tracking-[0.32em] text-white/15">
          Location data is approximate
        </p>

        <div className="flex items-center gap-3">
          <span className="h-1 w-1 rounded-full bg-white/40 shadow-[0_0_8px_white]" />

          <p className="text-[7px] uppercase tracking-[0.32em] text-white/25">
            Network online
          </p>
        </div>
      </footer>
    </section>
  );
}