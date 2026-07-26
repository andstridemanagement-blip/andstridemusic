"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SelectedWorkModalProps = {
  open: boolean;
  onClose: () => void;
};

type ProductionStatus = "Upcoming" | "Released";

type Production = {
  id: string;
  title: string;
  artists: string;
  year: string;
  sortDate: string;
  role: string;
  status: ProductionStatus;
  image: string;
  spotify?: string;
  appleMusic?: string;
  youtube?: string;
};

const PRODUCTIONS_SOURCE: Production[] = [
  {
    id: "blame-you",
    title: "Blame You",
    artists: "VeeAlwaysHere",
    year: "2021",
    sortDate: "2021-11-05",
    role: "Produced by Andstride & VeeAlwaysHere",
    status: "Released",
    image: "/credits/blame-you.jpg",
    spotify:
      "https://open.spotify.com/track/1Ss2e4hKtcIvLBb8hNHhrq?si=ccbed0f148794c5c",
  },
  {
    id: "i-dont-dance",
    title: "I Don’t Dance",
    artists: "VeeAlwaysHere × Ted Park",
    year: "2023",
    sortDate: "2023-04-28T00:00:00",
    role: "Produced by Andstride & VeeAlwaysHere",
    status: "Released",
    image: "/credits/i-dont-dance.jpg",
    spotify:
      "https://open.spotify.com/track/4yNgtC9QTvAnzLAbz73ylu?si=0800e659caee4b37",
  },
  {
    id: "somebody",
    title: "Somebody",
    artists: "VeeAlwaysHere",
    year: "2023",
    sortDate: "2023-04-28T00:00:01",
    role: "Produced by Andstride",
    status: "Released",
    image: "/credits/somebody.jpg",
    spotify:
      "https://open.spotify.com/track/1drXpvBEokAL2Btp1Uttrt?si=4889a0cf7aac4a56",
  },
  {
    id: "maslo",
    title: "Масло",
    artists: "ian360",
    year: "2023",
    sortDate: "2023-08-18",
    role: "Produced by Andstride",
    status: "Released",
    image: "/credits/maslo.jpg",
    spotify:
      "https://open.spotify.com/track/5S1Z8NgObGMlI9V2sBwY0v?si=0bb3d057a5dc439a",
  },
  {
    id: "if-i-could",
    title: "If I Could",
    artists: "Scoob & Sydney",
    year: "2026",
    sortDate: "2026-12-31",
    role: "Produced by Andstride",
    status: "Upcoming",
    image: "/credits/if-i-could.jpg",
  },
];

const PRODUCTIONS = [...PRODUCTIONS_SOURCE].sort(
  (first, second) =>
    new Date(second.sortDate).getTime() -
    new Date(first.sortDate).getTime()
);

function ProductionStatusBadge({
  status,
}: {
  status: ProductionStatus;
}) {
  const released = status === "Released";

  return (
    <div>
      <p className="text-[7px] uppercase tracking-[0.36em] text-white/25">
        Status
      </p>

      <div className="mt-3 flex items-center gap-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-emerald-300/80">
          {status}
        </p>

        <span className="relative flex h-2 w-2 items-center justify-center">
          {released && (
            <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-300/25 [animation-duration:2.6s]" />
          )}

          <span
            className={`relative h-1.5 w-1.5 rounded-full ${
              released
                ? "bg-emerald-200 shadow-[0_0_12px_rgba(167,243,208,0.9)]"
                : "border border-emerald-200/70 bg-transparent shadow-[0_0_10px_rgba(167,243,208,0.35)]"
            }`}
          />
        </span>
      </div>
    </div>
  );
}

function StreamingLinks({
  production,
}: {
  production: Production;
}) {
  const hasLinks =
    Boolean(production.spotify) ||
    Boolean(production.appleMusic) ||
    Boolean(production.youtube);

  if (!hasLinks) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
      <p className="text-[7px] uppercase tracking-[0.36em] text-white/25">
        Listen on
      </p>

      {production.spotify && (
        <a
          href={production.spotify}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-2 text-[10px] tracking-[0.04em] text-white/65 transition hover:text-white"
        >
          <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/45 text-[7px] transition group-hover:border-emerald-200/70 group-hover:text-emerald-200">
            S
          </span>

          Spotify
        </a>
      )}

      {production.appleMusic && (
        <a
          href={production.appleMusic}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-2 text-[10px] tracking-[0.04em] text-white/65 transition hover:text-white"
        >
          <span className="text-xs transition group-hover:text-emerald-200">
            ♪
          </span>

          Apple Music
        </a>
      )}

      {production.youtube && (
        <a
          href={production.youtube}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-2 text-[10px] tracking-[0.04em] text-white/65 transition hover:text-white"
        >
          <span className="text-xs transition group-hover:text-emerald-200">
            ▶
          </span>

          YouTube
        </a>
      )}
    </div>
  );
}

export default function SelectedWorkModal({
  open,
  onClose,
}: SelectedWorkModalProps) {
  const scrollContainerRef =
    useRef<HTMLDivElement | null>(null);

  const sectionRefs = useRef<
    Array<HTMLElement | null>
  >([]);

  const [activeIndex, setActiveIndex] =
    useState(0);

  const [imageErrors, setImageErrors] =
    useState<Record<string, boolean>>({});

  const sectionCount = PRODUCTIONS.length;

  const formattedActiveIndex = useMemo(
    () =>
      String(activeIndex + 1).padStart(2, "0"),
    [activeIndex]
  );

  const formattedTotal = String(
    sectionCount
  ).padStart(2, "0");

  useEffect(() => {
    if (!open) return;

    setActiveIndex(0);

    requestAnimationFrame(() => {
      scrollContainerRef.current?.scrollTo({
        top: 0,
        behavior: "auto",
      });
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown"
      ) {
        event.preventDefault();
        goToProduction(activeIndex + 1);
      }

      if (
        event.key === "ArrowUp" ||
        event.key === "PageUp"
      ) {
        event.preventDefault();
        goToProduction(activeIndex - 1);
      }

      if (event.key === "Home") {
        event.preventDefault();
        goToProduction(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        goToProduction(
          PRODUCTIONS.length - 1
        );
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [open, activeIndex, onClose]);

  useEffect(() => {
    if (!open) return;

    const root =
      scrollContainerRef.current;

    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter(
            (entry) => entry.isIntersecting
          )
          .sort(
            (first, second) =>
              second.intersectionRatio -
              first.intersectionRatio
          )[0];

        if (!visibleEntry) return;

        const nextIndex = Number(
          visibleEntry.target.getAttribute(
            "data-production-index"
          )
        );

        if (Number.isFinite(nextIndex)) {
          setActiveIndex(nextIndex);
        }
      },
      {
        root,
        threshold: [0.4, 0.55, 0.7],
      }
    );

    sectionRefs.current.forEach(
      (section) => {
        if (section) {
          observer.observe(section);
        }
      }
    );

    return () => {
      observer.disconnect();
    };
  }, [open]);

  function goToProduction(index: number) {
    const boundedIndex = Math.min(
      Math.max(index, 0),
      PRODUCTIONS.length - 1
    );

    setActiveIndex(boundedIndex);

    sectionRefs.current[
      boundedIndex
    ]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleImageError(
    productionId: string
  ) {
    setImageErrors((current) => ({
      ...current,
      [productionId]: true,
    }));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1500] bg-black">
      <div className="pointer-events-none absolute inset-0 z-30 border border-white/[0.08]" />

      <header className="pointer-events-none absolute left-0 right-0 top-0 z-40 flex h-20 items-center justify-between px-6 md:px-10">
        <p className="text-[8px] uppercase tracking-[0.52em] text-white/55">
          Andstride
        </p>

        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-5 md:flex">
          <span className="h-px w-14 bg-gradient-to-r from-transparent to-white/15" />

          <p className="text-[8px] uppercase tracking-[0.44em] text-white/65">
            Discography
          </p>

          <span className="h-px w-14 bg-gradient-to-l from-transparent to-white/15" />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="pointer-events-auto flex items-center gap-4 text-[8px] uppercase tracking-[0.35em] text-white/45 transition hover:text-white"
        >
          <span className="hidden sm:block">
            Close
          </span>

          <span className="text-2xl font-light leading-none">
            ×
          </span>
        </button>
      </header>

      <nav className="absolute bottom-24 left-6 top-24 z-40 hidden w-12 flex-col justify-center border-l border-white/[0.08] md:flex">
        <div className="flex flex-col gap-8">
          {PRODUCTIONS.map(
            (production, index) => {
              const active =
                index === activeIndex;

              return (
                <button
                  key={production.id}
                  type="button"
                  onClick={() =>
                    goToProduction(index)
                  }
                  aria-label={`Open ${production.title}`}
                  className="group relative flex h-7 items-center pl-7"
                >
                  <span
                    className={`absolute -left-px top-1/2 w-px -translate-y-1/2 transition-all duration-500 ${
                      active
                        ? "h-12 bg-emerald-200 shadow-[0_0_14px_rgba(167,243,208,0.7)]"
                        : "h-0 bg-white/30 group-hover:h-6"
                    }`}
                  />

                  <span
                    className={`font-mono text-[8px] transition ${
                      active
                        ? "text-white"
                        : "text-white/20 group-hover:text-white/55"
                    }`}
                  >
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>
                </button>
              );
            }
          )}
        </div>

        <div className="absolute bottom-0 left-5">
          <p className="font-mono text-[9px] text-white/55">
            {formattedActiveIndex}
          </p>

          <p className="mt-1 text-[6px] uppercase leading-3 tracking-[0.25em] text-white/20">
            {formattedTotal}
            <br />
            Entries
          </p>
        </div>
      </nav>

      <div className="absolute right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 md:flex">
        {PRODUCTIONS.map(
          (production, index) => {
            const active =
              index === activeIndex;

            return (
              <button
                key={production.id}
                type="button"
                onClick={() =>
                  goToProduction(index)
                }
                aria-label={`Go to ${production.title}`}
                className={`h-1.5 w-1.5 rounded-full border transition duration-300 ${
                  active
                    ? "border-emerald-200 bg-emerald-200 shadow-[0_0_10px_rgba(167,243,208,0.9)]"
                    : "border-white/20 bg-white/15 hover:border-white/60"
                }`}
              />
            );
          }
        )}
      </div>

      <div
        ref={scrollContainerRef}
        className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain scroll-smooth"
      >
        {PRODUCTIONS.map(
          (production, index) => {
            const imageFailed =
              imageErrors[production.id];

            return (
              <section
                key={production.id}
                ref={(element) => {
                  sectionRefs.current[index] =
                    element;
                }}
                data-production-index={index}
                className="relative flex min-h-[100svh] snap-start items-center overflow-hidden border-b border-white/[0.08] bg-[#030303] px-6 pb-16 pt-24 md:px-24 lg:px-32"
              >
                <div className="pointer-events-none absolute inset-0">
                  {!imageFailed && (
                    <img
                      src={production.image}
                      alt=""
                      onError={() =>
                        handleImageError(
                          production.id
                        )
                      }
                      className="absolute inset-0 h-full w-full object-cover object-center opacity-70"
                    />
                  )}

                  <div className="absolute inset-0 bg-[linear-gradient(90deg,#020202_0%,rgba(2,2,2,0.96)_19%,rgba(2,2,2,0.73)_48%,rgba(2,2,2,0.25)_76%,rgba(2,2,2,0.68)_100%)]" />

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.6)_0%,transparent_25%,transparent_72%,rgba(0,0,0,0.72)_100%)]" />

                  <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.65)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.65)_1px,transparent_1px)] [background-size:64px_64px]" />

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_45%,transparent_0%,rgba(0,0,0,0.15)_30%,rgba(0,0,0,0.82)_92%)]" />

                  {imageFailed && (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(255,255,255,0.12),transparent_28%)]" />

                      <div className="absolute right-[12%] top-1/2 h-[42vh] w-[24vw] -translate-y-1/2 bg-white/[0.025] blur-3xl" />
                    </>
                  )}
                </div>

                <div className="relative z-10 w-full max-w-5xl">
                  <p className="font-mono text-sm tracking-[0.35em] text-white/65 md:text-base">
                    {production.year}
                  </p>

                  <span className="mt-3 block h-px w-8 bg-white/65" />

                  <h2 className="mt-8 max-w-[780px] text-[clamp(3rem,8vw,8.5rem)] font-light uppercase leading-[0.84] tracking-[0.02em] text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.12)]">
                    {production.title}
                  </h2>

                  <p className="mt-7 text-[clamp(0.9rem,1.65vw,1.55rem)] uppercase tracking-[0.3em] text-white/68">
                    {production.artists}
                  </p>

                  <div className="mt-8 h-px w-8 bg-white/50" />

                  <p className="mt-8 text-[7px] uppercase tracking-[0.36em] text-white/28">
                    Production credit
                  </p>

                  <p className="mt-3 text-[11px] uppercase tracking-[0.35em] text-white/72">
                    {production.role}
                  </p>

                  <div className="mt-14 flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      {production.status ===
                      "Released" ? (
                        <StreamingLinks
                          production={production}
                        />
                      ) : (
                        <ProductionStatusBadge
                          status={
                            production.status
                          }
                        />
                      )}
                    </div>

                    {production.status ===
                      "Released" && (
                      <ProductionStatusBadge
                        status={
                          production.status
                        }
                      />
                    )}
                  </div>
                </div>

                <div className="absolute bottom-8 right-8 z-20 hidden items-center gap-5 md:flex">
                  <p className="text-[7px] uppercase tracking-[0.35em] text-white/30">
                    {index <
                    PRODUCTIONS.length - 1
                      ? "Scroll"
                      : "End"}
                  </p>

                  <span className="h-px w-12 bg-white/25" />

                  <button
                    type="button"
                    disabled={
                      index ===
                      PRODUCTIONS.length - 1
                    }
                    onClick={() =>
                      goToProduction(index + 1)
                    }
                    aria-label="Next production"
                    className="text-lg text-white/50 transition hover:text-white disabled:cursor-default disabled:text-white/10"
                  >
                    ↓
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent shadow-[0_0_14px_rgba(255,255,255,0.25)]" />
              </section>
            );
          }
        )}
      </div>

      <div className="pointer-events-none absolute bottom-5 left-1/2 z-40 -translate-x-1/2 md:hidden">
        <p className="font-mono text-[8px] tracking-[0.3em] text-white/45">
          {formattedActiveIndex} /{" "}
          {formattedTotal}
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-28 bg-gradient-to-t from-black/70 to-transparent" />
    </div>
  );
}