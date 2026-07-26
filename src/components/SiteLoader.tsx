"use client";

import { useEffect, useState } from "react";

type SiteLoaderProps = {
  onComplete?: () => void;
};

export default function SiteLoader({
  onComplete,
}: SiteLoaderProps) {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => {
      setLeaving(true);
    }, 650);

    const removeTimer = window.setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 1200);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(removeTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[2000] flex items-center justify-center bg-black transition-all duration-500 ${
        leaving
          ? "pointer-events-none scale-[1.02] opacity-0 blur-sm"
          : "scale-100 opacity-100 blur-0"
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <p
          className="
            loader-logo
            translate-x-[0.28em]
            text-xl
            font-black
            uppercase
            tracking-[0.56em]
            text-white
            md:text-3xl
          "
        >
          Andstride
        </p>

        <div className="mt-5 h-px w-52 overflow-hidden bg-white/10">
          <div className="loader-progress h-full bg-white" />
        </div>

        <p
          className="
            mt-4
            translate-x-[0.23em]
            font-mono
            text-[8px]
            uppercase
            tracking-[0.46em]
            text-white/30
          "
        >
          Loading Experience
        </p>
      </div>
    </div>
  );
}