export default function Background() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">

      {/* dark base */}
      <div className="absolute inset-0 bg-black" />

      {/* center light */}
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[120px]" />

      {/* road light */}
      <div className="absolute bottom-0 left-1/2 h-[500px] w-[250px] -translate-x-1/2 bg-gradient-to-t from-white/20 to-transparent blur-3xl" />

      {/* fog */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black" />

    </div>
  );
}