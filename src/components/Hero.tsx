export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="glow absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)]" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-7xl md:text-[10rem] font-black tracking-[0.45em]">
          ANDSTRIDE
        </h1>

        <p className="mt-8 uppercase tracking-[0.6em] text-zinc-500">
          NIGHT RIDES • DARK SOUND
        </p>

        <a
  href="/ride"
  className="mt-14 border border-zinc-600 px-10 py-4 uppercase tracking-[0.25em] transition-all duration-500 hover:border-white hover:bg-white hover:text-black"
>
  Explore
</a>
      </div>
    </section>
  );
}