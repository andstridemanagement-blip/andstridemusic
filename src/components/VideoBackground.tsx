"use client";

import { useEffect, useState } from "react";

type VideoBackgroundProps = {
  src: string;
};

export default function VideoBackground({
  src,
}: VideoBackgroundProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
  }, [src]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <video
        key={src}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        onCanPlay={() => setReady(true)}
        className={`
          absolute
          inset-0
          h-full
          w-full
          object-cover
          brightness-[0.78]
          contrast-125
          saturate-[1.08]
          animate-[slowZoom_18s_linear_infinite_alternate]
          transition-opacity
          duration-500
          ${ready ? "opacity-100" : "opacity-0"}
        `}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/55" />

      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_42%,rgba(0,0,0,0.65)_100%)]" />
    </div>
  );
}