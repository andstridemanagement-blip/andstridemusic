"use client";

import { useState } from "react";

export default function Player() {
  const [playing, setPlaying] = useState(false);

  return (
    <div>

      <div className="mb-6 flex h-12 items-center gap-1">
        {[1,2,3,4,5,6,7,8,9,10].map((bar) => (
          <div
            key={bar}
            className={`w-1 bg-white transition-all duration-300 ${
              playing ? "h-12 animate-pulse" : "h-3"
            }`}
          />
        ))}
      </div>


      <button
        onClick={() => setPlaying(!playing)}
        className="w-full border border-white py-4 uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
      >
        {playing ? "Pause" : "Play"}
      </button>

    </div>
  );
}