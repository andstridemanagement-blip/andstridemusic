export default function City() {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-0 h-72 overflow-hidden">

      {/* Buildings */}
      <div className="absolute bottom-0 left-0 flex h-full w-full items-end gap-2 opacity-40">

        <div className="h-40 w-20 bg-zinc-900" />
        <div className="h-56 w-24 bg-zinc-800" />
        <div className="h-32 w-16 bg-zinc-900" />
        <div className="h-72 w-28 bg-zinc-800" />
        <div className="h-48 w-20 bg-zinc-900" />
        <div className="h-64 w-24 bg-zinc-800" />
        <div className="h-36 w-16 bg-zinc-900" />

      </div>


      {/* Road light */}
      <div className="absolute bottom-0 left-1/2 h-48 w-96 -translate-x-1/2 bg-white/10 blur-[100px]" />

    </div>
  );
}