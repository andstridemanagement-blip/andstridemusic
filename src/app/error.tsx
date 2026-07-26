"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_55%)]" />

      <section className="relative z-10 max-w-lg text-center">
        <p className="text-[9px] uppercase tracking-[0.6em] text-white/25">
          Playback Interrupted
        </p>

        <h1 className="mt-6 text-5xl font-black uppercase tracking-[0.1em] md:text-7xl">
          Something Went Wrong
        </h1>

        <p className="mt-6 text-sm leading-7 text-white/35">
          The page could not be loaded correctly. You can
          retry without leaving the site.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="border border-white bg-white px-7 py-4 text-[9px] uppercase tracking-[0.32em] text-black transition hover:bg-transparent hover:text-white"
          >
            Try Again
          </button>

          <a
            href="/"
            className="border border-white/15 px-7 py-4 text-[9px] uppercase tracking-[0.32em] text-white/40 transition hover:border-white/40 hover:text-white"
          >
            Return Home
          </a>
        </div>
      </section>
    </main>
  );
}