"use client";

import { useEffect, useState } from "react";

function getTime() {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
}

export default function LocalTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(getTime());

    const timer = window.setInterval(() => {
      setTime(getTime());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="text-right">
      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">
        {time || "--:--"}
      </p>

      <p className="mt-1 text-[7px] uppercase tracking-[0.35em] text-white/15">
        Local Time
      </p>
    </div>
  );
}