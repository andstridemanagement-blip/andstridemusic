"use client";

import {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import AboutModal from "../../components/AboutModal";
import CameraEffect from "../../components/CameraEffect";
import ConnectModal from "../../components/ConnectModal";
import CursorFX from "../../components/CursorFX";
import LicenseModal from "../../components/LicenseModal";
import LiveMapModal from "../../components/LiveMapModal";
import ReleaseList from "../../components/ReleaseList";
import RideHeader from "../../components/RideHeader";
import SiteLoader from "../../components/SiteLoader";
import TrackHero from "../../components/TrackHero";
import TracklistModal from "../../components/TracklistModal";
import VideoBackground from "../../components/VideoBackground";
import SelectedWorkModal from "../../components/SelectedWorkModal";

import { tracks } from "../../data/tracks";

const FADE_OUT_TIME = 360;
const FADE_IN_TIME = 440;

type ParallaxPosition = {
  x: number;
  y: number;
};

export default function Ride() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [pendingTrackIndex, setPendingTrackIndex] = useState(0);

  const [transitioning, setTransitioning] = useState(false);
  const [playing, setPlaying] = useState(false);

  const [licenseOpen, setLicenseOpen] = useState(false);
  const [tracklistOpen, setTracklistOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
const [selectedWorkOpen, setSelectedWorkOpen] =
  useState(false);
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const [parallax, setParallax] = useState<ParallaxPosition>({
    x: 0,
    y: 0,
  });

  const transitionRef = useRef(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const recordedTracksRef = useRef<Set<string>>(
    new Set()
  );

  const changeTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const finishTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const shareTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentTrack = tracks[trackIndex];
  const pendingTrack = tracks[pendingTrackIndex];

  const closeAllOverlays = useCallback(() => {
    setLicenseOpen(false);
    setTracklistOpen(false);
    setAboutOpen(false);
    setConnectOpen(false);
    setMapOpen(false);
    setMoreOpen(false);
  }, []);

  const changeToTrack = useCallback(
    (nextIndex: number) => {
      if (
        transitionRef.current ||
        nextIndex === trackIndex ||
        nextIndex < 0 ||
        nextIndex >= tracks.length
      ) {
        setTracklistOpen(false);
        return;
      }

      transitionRef.current = true;

      setPendingTrackIndex(nextIndex);
      setTransitioning(true);
      setPlaying(false);
      closeAllOverlays();

      changeTimerRef.current = setTimeout(() => {
        setTrackIndex(nextIndex);

        finishTimerRef.current = setTimeout(() => {
          transitionRef.current = false;
          setTransitioning(false);
        }, FADE_IN_TIME);
      }, FADE_OUT_TIME);
    },
    [closeAllOverlays, trackIndex]
  );

  const previousTrack = useCallback(() => {
    const nextIndex =
      trackIndex === 0
        ? tracks.length - 1
        : trackIndex - 1;

    changeToTrack(nextIndex);
  }, [changeToTrack, trackIndex]);

  const nextTrack = useCallback(() => {
    const nextIndex =
      trackIndex === tracks.length - 1
        ? 0
        : trackIndex + 1;

    changeToTrack(nextIndex);
  }, [changeToTrack, trackIndex]);

  function returnHome() {
    window.location.href = "/";
  }

  async function recordListen() {
    if (
      recordedTracksRef.current.has(
        currentTrack.slug
      )
    ) {
      return;
    }

    recordedTracksRef.current.add(
      currentTrack.slug
    );

    try {
      const response = await fetch("/api/listens", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          trackSlug: currentTrack.slug,
          trackTitle: currentTrack.title,
        }),
      });

      if (!response.ok) {
  const errorText = await response.text();

  throw new Error(
    `Listen request failed with status ${response.status}: ${errorText}`
  );
}
    } catch (error) {
      recordedTracksRef.current.delete(
        currentTrack.slug
      );

      console.error(
        "Unable to record listen:",
        error
      );
    }
  }

  async function toggleFullscreen() {
    setMoreOpen(false);

    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error(
        "Fullscreen mode is unavailable:",
        error
      );
    }
  }

  async function shareTrack() {
    const shareUrl =
      `${window.location.origin}/ride?track=${currentTrack.slug}`;

    setMoreOpen(false);

    try {
      await navigator.clipboard.writeText(shareUrl);

      setShareCopied(true);

      if (shareTimerRef.current) {
        clearTimeout(shareTimerRef.current);
      }

      shareTimerRef.current = setTimeout(() => {
        setShareCopied(false);
      }, 1800);
    } catch {
      window.prompt(
        "Copy this track link:",
        shareUrl
      );
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const requestedTrack = params.get("track");

    if (requestedTrack) {
      const requestedIndex = tracks.findIndex(
        (track) =>
          track.slug === requestedTrack
      );

      if (requestedIndex !== -1) {
        setTrackIndex(requestedIndex);
        setPendingTrackIndex(requestedIndex);
      }
    }

    function handleFullscreenChange() {
      setFullscreen(
        Boolean(document.fullscreenElement)
      );
    }

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  useEffect(() => {
    window.history.replaceState(
      {
        track: currentTrack.slug,
      },
      "",
      `/ride?track=${currentTrack.slug}`
    );

    document.title =
      `${currentTrack.title} | Andstride`;
  }, [currentTrack]);

  useEffect(() => {
    function handlePointerMove(
      event: PointerEvent
    ) {
      if (event.pointerType === "touch") {
        return;
      }

      const normalizedX =
        event.clientX / window.innerWidth - 0.5;

      const normalizedY =
        event.clientY / window.innerHeight - 0.5;

      setParallax({
        x: normalizedX * 8,
        y: normalizedY * 6,
      });
    }

    function resetParallax() {
      setParallax({
        x: 0,
        y: 0,
      });
    }

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    document.addEventListener(
      "mouseleave",
      resetParallax
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      document.removeEventListener(
        "mouseleave",
        resetParallax
      );
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      const target = event.target as Node;

      if (
        moreOpen &&
        moreMenuRef.current &&
        !moreMenuRef.current.contains(target)
      ) {
        setMoreOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [moreOpen]);

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        closeAllOverlays();
        return;
      }

      if (
        licenseOpen ||
        tracklistOpen ||
        aboutOpen ||
        connectOpen ||
        mapOpen ||
        moreOpen ||
        transitioning
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        previousTrack();
      }

      if (event.key === "ArrowRight") {
        nextTrack();
      }

      if (event.key.toLowerCase() === "t") {
        setTracklistOpen(true);
      }

      if (event.key.toLowerCase() === "f") {
        toggleFullscreen();
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
    };
  }, [
    aboutOpen,
    closeAllOverlays,
    connectOpen,
    licenseOpen,
    mapOpen,
    moreOpen,
    nextTrack,
    previousTrack,
    tracklistOpen,
    transitioning,
  ]);

  useEffect(() => {
    return () => {
      if (changeTimerRef.current) {
        clearTimeout(changeTimerRef.current);
      }

      if (finishTimerRef.current) {
        clearTimeout(finishTimerRef.current);
      }

      if (shareTimerRef.current) {
        clearTimeout(shareTimerRef.current);
      }
    };
  }, []);

  const pageStyle = {
    "--accent": currentTrack.accent,
  } as CSSProperties;

  return (
    <main
      style={pageStyle}
      className="relative h-screen overflow-hidden bg-black text-white"
    >
      <SiteLoader
        onComplete={() =>
          setLoaderComplete(true)
        }
      />

      <CursorFX />

      <div
        className={`absolute inset-0 transition-all duration-700 ease-out ${
          !loaderComplete
            ? "scale-[1.04] opacity-0 blur-md"
            : transitioning
              ? "scale-[1.025] opacity-60 blur-[2px]"
              : playing
                ? "scale-[1.012] opacity-100 blur-0"
                : "scale-100 opacity-100 blur-0"
        }`}
        style={{
          filter:
            "brightness(1.14) contrast(1.04) saturate(1.08)",
        }}
      >
        <CameraEffect>
          <VideoBackground
            key={currentTrack.video}
            src={currentTrack.video}
          />
        </CameraEffect>
      </div>

      <div
        className={`pointer-events-none absolute inset-0 z-10 transition-colors duration-700 ${
          playing
            ? "bg-black/[0.03]"
            : transitioning
              ? "bg-black/25"
              : "bg-black/10"
        }`}
      />

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/75 via-black/25 to-transparent" />

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/10 via-transparent to-black/30" />

      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_72%_25%,rgba(55,110,255,0.08),transparent_42%)]" />

      <div
        className={`pointer-events-none absolute -left-72 top-1/4 z-10 rounded-full blur-[200px] transition-all duration-700 ${
          playing
            ? "h-[720px] w-[720px] opacity-[0.14]"
            : "h-[600px] w-[600px] opacity-[0.07]"
        }`}
        style={{
          backgroundColor: currentTrack.accent,

          transform: `translate3d(
            ${parallax.x * -0.8}px,
            ${parallax.y * -0.8}px,
            0
          )`,
        }}
      />

      <RideHeader
        visible={loaderComplete}
        moreOpen={moreOpen}
        fullscreen={fullscreen}
        shareCopied={shareCopied}
        moreMenuRef={moreMenuRef}
        onHome={returnHome}
        onTracks={() => {
          window.location.href = "/beats";
        }}
        onAbout={() =>
          setAboutOpen(true)
        }
        onConnect={() =>
          setConnectOpen(true)
        }
        onMap={() => {
          setMoreOpen(false);
          setMapOpen(true);
        }}
        onToggleMore={() => {
          setMoreOpen(
            (current) => !current
          );
        }}
        onWork={() => setSelectedWorkOpen(true)}
        onShare={shareTrack}
        onFullscreen={toggleFullscreen}
      />

      <TrackHero
        track={currentTrack}
        trackIndex={trackIndex}
        visible={
          loaderComplete &&
          !transitioning
        }
        playing={playing}
        parallaxX={parallax.x}
        parallaxY={parallax.y}
        onBuy={() => {
  if (currentTrack.availability !== "available") {
    setLicenseOpen(true);
    return;
  }

  if (currentTrack.beatstarsUrl) {
    window.open(currentTrack.beatstarsUrl, "_blank", "noopener,noreferrer");
    return;
  }

  alert("BeatStars link has not been added yet.");
}}
        onEnded={nextTrack}
        onListen={recordListen}
        onPlayingChange={setPlaying}
      />

      <ReleaseList
        tracks={tracks}
        activeIndex={trackIndex}
        visible={loaderComplete}
        disabled={transitioning}
        onSelect={changeToTrack}
      />

      <footer className="absolute bottom-0 left-0 right-0 z-30 hidden h-12 items-center justify-between border-t border-white/[0.06] bg-black/15 px-10 backdrop-blur-md md:flex">
        <p className="text-[7px] uppercase tracking-[0.35em] text-white/12">
          © 2026 Andstride
        </p>

        <p className="text-[7px] uppercase tracking-[0.3em] text-white/12">
          Independent Producer
        </p>
      </footer>

      <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between border-t border-white/10 bg-black/60 px-6 py-4 backdrop-blur-xl md:hidden">
        <button
          type="button"
          onClick={previousTrack}
          disabled={transitioning}
          className="text-[8px] uppercase tracking-[0.25em] text-white/40 disabled:opacity-20"
        >
          ← Previous
        </button>

        <span className="font-mono text-[8px] text-white/20">
          {String(trackIndex + 1).padStart(
            2,
            "0"
          )}{" "}
          /{" "}
          {String(tracks.length).padStart(
            2,
            "0"
          )}
        </span>

        <button
          type="button"
          onClick={nextTrack}
          disabled={transitioning}
          className="text-[8px] uppercase tracking-[0.25em] text-white/40 disabled:opacity-20"
        >
          Next →
        </button>
      </div>

      <div
        className={`pointer-events-none absolute bottom-20 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
          transitioning
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0"
        }`}
      >
        <div className="border border-white/10 bg-black/60 px-6 py-4 text-center backdrop-blur-xl">
          <p className="text-[7px] uppercase tracking-[0.45em] text-white/20">
            Up Next
          </p>

          <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-white/65">
            {pendingTrack.title}
          </p>
        </div>
      </div>

      <LicenseModal
        open={licenseOpen}
        trackTitle={currentTrack.title}
        trackAvailability={currentTrack.availability}
        onClose={() =>
          setLicenseOpen(false)
        }
      />

      <TracklistModal
        open={tracklistOpen}
        tracks={tracks}
        currentTrackIndex={trackIndex}
        onSelectTrack={changeToTrack}
        onClose={() =>
          setTracklistOpen(false)
        }
      />

      <AboutModal
        open={aboutOpen}
        onClose={() =>
          setAboutOpen(false)
        }
      />

      <ConnectModal
        open={connectOpen}
        onClose={() =>
          setConnectOpen(false)
        }
      />

      <LiveMapModal
        open={mapOpen}
        onClose={() =>
          setMapOpen(false)
        }
      />
      <SelectedWorkModal
  open={selectedWorkOpen}
  onClose={() => setSelectedWorkOpen(false)}
/>
    </main>
  );
}