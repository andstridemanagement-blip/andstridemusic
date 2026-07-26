"use client";

import { useEffect, useState } from "react";

export default function CameraEffect({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 8,
        y: (e.clientY / window.innerHeight - 0.5) * 8,
      });
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        transform: `
          translate(${mouse.x}px, ${mouse.y}px)
          scale(1.08)
        `,
        transition: "transform .35s ease-out",
      }}
    >
      {children}
    </div>
  );
}