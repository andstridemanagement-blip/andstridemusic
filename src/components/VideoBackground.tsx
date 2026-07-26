type VideoBackgroundProps = {
  src: string;
};

export default function VideoBackground({
  src,
}: VideoBackgroundProps) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <video
        key={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          brightness-[0.78]
          contrast-125
          saturate-[1.08]
          animate-[slowZoom_18s_linear_infinite_alternate]
        "
      >
        <source src={src} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/55" />

      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_42%,rgba(0,0,0,0.65)_100%)]" />
    </div>
  );
}