"use client";

import { useEffect, useState } from "react";

export default function TrackCover({ playing }: { playing: boolean }) {
  return (
    <div
      className={`h-64 w-64 rounded-full border border-zinc-700 bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center ${
        playing ? "animate-spin" : ""
      }`}
      style={{
        animationDuration: "8s",
      }}
    >
      <div className="h-20 w-20 rounded-full bg-black border border-zinc-700 flex items-center justify-center">
        <div className="h-3 w-3 rounded-full bg-white" />
      </div>
    </div>
  );
}