import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_55%)]" />

      <div className="relative z-10 text-center">
        <p className="text-[9px] uppercase tracking-[0.65em] text-white/25">
          Page Not Found
        </p>

        <h1 className="mt-6 text-7xl font-black tracking-[0.12em] text-white/90 md:text-9xl">
          404
        </h1>

        <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-white/35">
          The page you were looking for does not exist or has
          been moved.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="border border-white bg-white px-7 py-4 text-[9px] uppercase tracking-[0.32em] text-black transition hover:bg-transparent hover:text-white"
          >
            Return Home
          </Link>

          <Link
            href="/beats"
            className="border border-white/15 px-7 py-4 text-[9px] uppercase tracking-[0.32em] text-white/45 transition hover:border-white/45 hover:text-white"
          >
            Browse Beats
          </Link>
        </div>
      </div>

      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[7px] uppercase tracking-[0.4em] text-white/15">
        Andstride
      </p>
    </main>
  );
}