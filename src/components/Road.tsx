export default function Road() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[55vh] overflow-hidden">

      {/* asphalt */}
      <div
        className="
        absolute bottom-0 left-1/2
        h-full w-[140%]
        -translate-x-1/2
        bg-gradient-to-t
        from-zinc-950
        via-zinc-900/40
        to-transparent
        "
      />


      {/* perspective road */}
      <div
        className="
        absolute bottom-[-20%]
        left-1/2
        h-[80%]
        w-[45%]
        -translate-x-1/2
        bg-black/80
        [clip-path:polygon(40%_0,60%_0,100%_100%,0_100%)]
        "
      />


      {/* lane light */}
      <div className="
        absolute bottom-0 left-1/2
        h-[80%]
        w-[3px]
        -translate-x-1/2
        bg-white/20
        blur-sm
      "/>


      {/* headlight */}
      <div
        className="
        absolute
        bottom-0
        left-1/2
        h-96
        w-[600px]
        -translate-x-1/2
        bg-white/10
        blur-[120px]
        "
      />

    </div>
  );
}