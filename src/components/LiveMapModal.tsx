"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type LiveMapModalProps = {
  open: boolean;
  onClose: () => void;
};

type ListenEvent = {
  id: number | string;
  track_slug: string;
  track_title: string;
  city: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  created_at: string;
};

const REFRESH_INTERVAL = 30_000;
const MAX_VISIBLE_SIGNALS = 30;

function normalizeText(
  value: unknown,
  fallback: string
) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();

  if (
    !trimmed ||
    trimmed.toLowerCase() === "unknown" ||
    trimmed.toLowerCase() === "undefined" ||
    trimmed.toLowerCase() === "null"
  ) {
    return fallback;
  }

  return trimmed;
}

function normalizeEvent(
  value: unknown,
  index: number
): ListenEvent | null {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return null;
  }

  const item = value as Record<string, unknown>;

  const createdAt =
    typeof item.created_at === "string"
      ? item.created_at
      : typeof item.createdAt === "string"
        ? item.createdAt
        : "";

  if (!createdAt) {
    return null;
  }

  const trackSlug = normalizeText(
    item.track_slug ?? item.trackSlug,
    ""
  );

  const trackTitle = normalizeText(
    item.track_title ?? item.trackTitle,
    "Unknown Track"
  );

  return {
    id:
      typeof item.id === "number" ||
      typeof item.id === "string"
        ? item.id
        : `${createdAt}-${index}`,

    track_slug: trackSlug,

    track_title: trackTitle,

    city: normalizeText(
      item.city,
      "Unknown"
    ),

    country: normalizeText(
      item.country,
      "Unknown"
    ),

    latitude:
      typeof item.latitude === "number"
        ? item.latitude
        : null,

    longitude:
      typeof item.longitude === "number"
        ? item.longitude
        : null,

    created_at: createdAt,
  };
}

function extractEvents(payload: unknown) {
  let rawEvents: unknown[] = [];

  if (Array.isArray(payload)) {
    rawEvents = payload;
  } else if (
    typeof payload === "object" &&
    payload !== null
  ) {
    const objectPayload =
      payload as Record<string, unknown>;

    if (Array.isArray(objectPayload.events)) {
      rawEvents = objectPayload.events;
    } else if (
      Array.isArray(objectPayload.listens)
    ) {
      rawEvents = objectPayload.listens;
    } else if (
      Array.isArray(objectPayload.data)
    ) {
      rawEvents = objectPayload.data;
    }
  }

  return rawEvents
    .map(normalizeEvent)
    .filter(
      (
        event
      ): event is ListenEvent => event !== null
    );
}

function getLocation(event: ListenEvent) {
  const city =
    event.city === "Unknown"
      ? null
      : event.city;

  const country =
    event.country === "Unknown"
      ? null
      : event.country;

  if (city && country) {
    return `${city}, ${country}`;
  }

  if (city) {
    return city;
  }

  if (country) {
    return country;
  }

  return "Unknown Location";
}

function getRelativeTime(
  dateString: string,
  now: number
) {
  const timestamp =
    new Date(dateString).getTime();

  if (!Number.isFinite(timestamp)) {
    return "Unknown";
  }

  const seconds = Math.max(
    0,
    Math.floor((now - timestamp) / 1000)
  );

  if (seconds < 10) {
    return "Just now";
  }

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 30) {
    return `${days}d ago`;
  }

  return new Date(dateString)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    .toUpperCase();
}

function getEventTimestamp(event: ListenEvent) {
  const timestamp =
    new Date(event.created_at).getTime();

  return Number.isFinite(timestamp)
    ? timestamp
    : 0;
}

function SignalIndicator({
  active,
}: {
  active: boolean;
}) {
  return (
    <span className="relative flex h-3 w-3 shrink-0 items-center justify-center">
      {active && (
        <span className="absolute h-3 w-3 animate-ping rounded-full bg-white/20 [animation-duration:2.4s]" />
      )}

      <span
        className={`relative h-1.5 w-1.5 rounded-full ${
          active
            ? "bg-white shadow-[0_0_14px_rgba(255,255,255,0.95)]"
            : "bg-white/20"
        }`}
      />
    </span>
  );
}

export default function LiveMapModal({
  open,
  onClose,
}: LiveMapModalProps) {
  const [events, setEvents] = useState<
    ListenEvent[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [now, setNow] = useState(0);

  const [lastUpdated, setLastUpdated] =
    useState<number | null>(null);

  const loadSignals = useCallback(
    async (showLoader = false) => {
      if (showLoader) {
        setLoading(true);
      }

      try {
        const response = await fetch(
          "/api/listens",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Request failed: ${response.status}`
          );
        }

        const payload: unknown =
          await response.json();

        const nextEvents =
          extractEvents(payload);

        setEvents(nextEvents);
        setLastUpdated(Date.now());
        setError(null);
      } catch (fetchError) {
        console.error(
          "Unable to load listening signals:",
          fetchError
        );

        setError(
          "Unable to establish signal connection"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!open) return;

    setNow(Date.now());

    void loadSignals(true);

    const timeInterval =
      window.setInterval(() => {
        setNow(Date.now());
      }, 10_000);

    const refreshInterval =
      window.setInterval(() => {
        void loadSignals(false);
      }, REFRESH_INTERVAL);

    return () => {
      window.clearInterval(timeInterval);
      window.clearInterval(
        refreshInterval
      );
    };
  }, [open, loadSignals]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.body.style.overflow =
      "hidden";

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const sortedEvents = useMemo(() => {
    return [...events]
      .sort(
        (first, second) =>
          getEventTimestamp(second) -
          getEventTimestamp(first)
      )
      .slice(0, MAX_VISIBLE_SIGNALS);
  }, [events]);

  const signalsLastThirtyDays =
    useMemo(() => {
      const currentTime =
        now || Date.now();

      const threshold =
        currentTime -
        30 * 24 * 60 * 60 * 1000;

      return events.filter(
        (event) =>
          getEventTimestamp(event) >=
          threshold
      ).length;
    }, [events, now]);

  const uniqueLocations = useMemo(() => {
    const locations = new Set(
      events
        .map(getLocation)
        .filter(
          (location) =>
            location !==
            "Unknown Location"
        )
    );

    return locations.size;
  }, [events]);

  const uniqueTracks = useMemo(() => {
    return new Set(
      events.map(
        (event) => event.track_title
      )
    ).size;
  }, [events]);

  function openTrack(event: ListenEvent) {
    if (!event.track_slug) {
      return;
    }

    onClose();

    window.location.assign(
      `/ride?track=${encodeURIComponent(
        event.track_slug
      )}`
    );
  }

  if (!open) {
    return null;
  }

  const connectionActive =
    !error && !loading;

  return (
    <div className="fixed inset-0 z-[1400] flex items-center justify-center bg-black/95 px-3 py-3 backdrop-blur-xl md:px-6 md:py-6">
      <button
        type="button"
        aria-label="Close signal feed"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <section className="relative z-10 flex max-h-[94vh] w-full max-w-[1380px] flex-col overflow-hidden border border-white/[0.11] bg-[#030405] shadow-[0_0_160px_rgba(0,0,0,0.98)]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.75)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.75)_1px,transparent_1px)] [background-size:46px_46px]" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_16%,rgba(255,255,255,0.055),transparent_38%)]" />

        <header className="relative shrink-0 border-b border-white/[0.09] px-6 py-6 md:px-10 md:py-9">
          <div className="flex items-start justify-between gap-8">
            <div>
              <div className="flex items-center gap-3">
                <SignalIndicator
                  active={connectionActive}
                />

                <p className="text-[8px] uppercase tracking-[0.48em] text-white/30">
                  Recent listening activity
                </p>
              </div>

              <h2 className="mt-5 text-4xl font-black uppercase tracking-[0.08em] text-white md:text-6xl">
                Signal Feed
              </h2>

              <p className="mt-4 max-w-2xl text-[9px] uppercase leading-6 tracking-[0.24em] text-white/25">
                Live transmission log from
                recent listeners across the
                network
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-3xl leading-none text-white/25 transition hover:rotate-90 hover:text-white"
            >
              ×
            </button>
          </div>
        </header>

        <div className="relative grid shrink-0 grid-cols-2 border-b border-white/[0.09] md:grid-cols-4">
          <div className="border-r border-white/[0.07] px-5 py-5 md:px-8">
            <p className="text-[7px] uppercase tracking-[0.34em] text-white/18">
              Signals / 30d
            </p>

            <p className="mt-3 font-mono text-2xl text-white/80">
              {String(
                signalsLastThirtyDays
              ).padStart(3, "0")}
            </p>
          </div>

          <div className="px-5 py-5 md:border-r md:border-white/[0.07] md:px-8">
            <p className="text-[7px] uppercase tracking-[0.34em] text-white/18">
              Locations
            </p>

            <p className="mt-3 font-mono text-2xl text-white/80">
              {String(
                uniqueLocations
              ).padStart(3, "0")}
            </p>
          </div>

          <div className="border-r border-t border-white/[0.07] px-5 py-5 md:border-t-0 md:px-8">
            <p className="text-[7px] uppercase tracking-[0.34em] text-white/18">
              Tracks accessed
            </p>

            <p className="mt-3 font-mono text-2xl text-white/80">
              {String(
                uniqueTracks
              ).padStart(3, "0")}
            </p>
          </div>

          <div className="border-t border-white/[0.07] px-5 py-5 md:border-t-0 md:px-8">
            <p className="text-[7px] uppercase tracking-[0.34em] text-white/18">
              Connection
            </p>

            <div className="mt-4 flex items-center gap-3">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  error
                    ? "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]"
                    : connectionActive
                      ? "bg-white shadow-[0_0_10px_white]"
                      : "bg-white/25"
                }`}
              />

              <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-white/60">
                {error
                  ? "Interrupted"
                  : loading
                    ? "Connecting"
                    : "Online"}
              </p>
            </div>
          </div>
        </div>

        <div className="relative min-h-0 flex-1 overflow-y-auto">
          <div className="sticky top-0 z-10 hidden grid-cols-[70px_minmax(180px,1.5fr)_minmax(150px,1fr)_130px_40px] border-b border-white/[0.08] bg-[#030405]/95 px-8 py-4 text-[7px] uppercase tracking-[0.34em] text-white/18 backdrop-blur-xl md:grid">
            <span>Signal</span>
            <span>Location</span>
            <span>Track accessed</span>
            <span>Received</span>
            <span />
          </div>

          {loading &&
          sortedEvents.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <SignalIndicator active />

              <p className="mt-6 animate-pulse text-[9px] uppercase tracking-[0.36em] text-white/35">
                Establishing connection
              </p>

              <p className="mt-3 text-[7px] uppercase tracking-[0.28em] text-white/15">
                Retrieving transmission log
              </p>
            </div>
          ) : error &&
            sortedEvents.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
              <span className="h-2 w-2 rounded-full bg-red-400 shadow-[0_0_16px_rgba(248,113,113,0.75)]" />

              <p className="mt-6 text-[9px] uppercase tracking-[0.34em] text-white/40">
                Signal interrupted
              </p>

              <p className="mt-3 text-[8px] uppercase tracking-[0.22em] text-white/18">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  void loadSignals(true)
                }
                className="mt-8 border border-white/15 px-6 py-3 text-[8px] uppercase tracking-[0.3em] text-white/40 transition hover:border-white/50 hover:text-white"
              >
                Retry connection
              </button>
            </div>
          ) : sortedEvents.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <SignalIndicator active={false} />

              <p className="mt-6 text-[9px] uppercase tracking-[0.36em] text-white/35">
                Awaiting signal
              </p>

              <p className="mt-3 text-[7px] uppercase tracking-[0.28em] text-white/15">
                Listening activity will
                appear here
              </p>
            </div>
          ) : (
            <div>
              {sortedEvents.map(
                (event, index) => {
                  const latest =
                    index === 0;

                  return (
                    <div
                      key={`${event.id}-${event.created_at}`}
                      role={
                        event.track_slug
                          ? "button"
                          : undefined
                      }
                      tabIndex={
                        event.track_slug
                          ? 0
                          : -1
                      }
                      onClick={() => {
                        if (event.track_slug) {
                          openTrack(event);
                        }
                      }}
                      onKeyDown={(keyboardEvent) => {
                        if (!event.track_slug) {
                          return;
                        }

                        if (
                          keyboardEvent.key === "Enter" ||
                          keyboardEvent.key === " "
                        ) {
                          keyboardEvent.preventDefault();
                          openTrack(event);
                        }
                      }}
                      className={`group grid w-full grid-cols-[42px_minmax(0,1fr)_24px] items-center gap-3 border-b border-white/[0.055] px-5 py-5 text-left transition duration-300 md:grid-cols-[70px_minmax(180px,1.5fr)_minmax(150px,1fr)_130px_40px] md:gap-0 md:px-8 ${
                        event.track_slug
                          ? "cursor-pointer hover:bg-white/[0.035]"
                          : "cursor-default"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <SignalIndicator
                          active={latest}
                        />

                        <span className="hidden font-mono text-[8px] text-white/20 md:block">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-semibold uppercase tracking-[0.13em] text-white/65 transition group-hover:text-white">
                          {getLocation(
                            event
                          )}
                        </p>

                        <div className="mt-2 flex items-center gap-2 md:hidden">
                          <p className="truncate text-[7px] uppercase tracking-[0.24em] text-white/22">
                            {
                              event.track_title
                            }
                          </p>

                          <span className="text-white/10">
                            /
                          </span>

                          <p className="whitespace-nowrap font-mono text-[7px] uppercase text-white/18">
                            {now
                              ? getRelativeTime(
                                  event.created_at,
                                  now
                                )
                              : "Connecting"}
                          </p>
                        </div>
                      </div>

                      <p className="hidden truncate text-[9px] font-medium uppercase tracking-[0.22em] text-white/35 transition group-hover:text-white/75 md:block">
                        {
                          event.track_title
                        }
                      </p>

                      <p className="hidden whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.1em] text-white/20 md:block">
                        {now
                          ? getRelativeTime(
                              event.created_at,
                              now
                            )
                          : "Connecting"}
                      </p>

                      <button
                        type="button"
                        aria-label={`Open ${event.track_title}`}
                        disabled={!event.track_slug}
                        onClick={(clickEvent) => {
                          clickEvent.stopPropagation();

                          if (!event.track_slug) {
                            return;
                          }

                          openTrack(event);
                        }}
                        className="
                          relative
                          z-20
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          justify-self-end
                          border
                          border-white/[0.08]
                          text-white/25
                          transition
                          duration-300
                          hover:border-white/35
                          hover:bg-white/[0.06]
                          hover:text-white
                          disabled:cursor-default
                          disabled:opacity-20
                        "
                      >
                        {event.track_slug ? "→" : "·"}
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        <footer className="relative flex shrink-0 flex-col gap-3 border-t border-white/[0.09] px-6 py-4 md:flex-row md:items-center md:justify-between md:px-10">
          <p className="text-[7px] uppercase tracking-[0.3em] text-white/15">
            Listener locations are
            approximate · Exact addresses are
            never stored
          </p>

          <div className="flex items-center gap-3">
            <span className="h-1 w-1 rounded-full bg-white/35 shadow-[0_0_8px_white]" />

            <p className="text-[7px] uppercase tracking-[0.3em] text-white/22">
              {lastUpdated
                ? `Updated ${getRelativeTime(
                    new Date(
                      lastUpdated
                    ).toISOString(),
                    now || Date.now()
                  )}`
                : "Awaiting update"}
            </p>
          </div>
        </footer>
      </section>
    </div>
  );
}