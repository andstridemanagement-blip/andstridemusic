"use client";

import { useEffect, useState } from "react";

type CursorPosition = {
  x: number;
  y: number;
};

export default function CursorFX() {
  const [position, setPosition] = useState<CursorPosition>({
    x: -100,
    y: -100,
  });

  const [ringPosition, setRingPosition] = useState<CursorPosition>({
    x: -100,
    y: -100,
  });

  const [visible, setVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("custom-cursor-enabled");

    let animationFrameId = 0;
    let targetX = -100;
    let targetY = -100;
    let currentRingX = -100;
    let currentRingY = -100;

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType === "touch") {
        return;
      }

      targetX = event.clientX;
      targetY = event.clientY;

      setPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setVisible(true);

      const target = event.target as HTMLElement | null;

      const isInteractive = Boolean(
        target?.closest(
          "button, a, input, [role='slider'], [data-cursor='interactive']"
        )
      );

      setInteractive(isInteractive);
    }

    function handlePointerDown(event: PointerEvent) {
      if (event.pointerType === "touch") {
        return;
      }

      setPressed(true);
    }

    function handlePointerUp() {
      setPressed(false);
    }

    function handleMouseLeave() {
      setVisible(false);
    }

    function handleMouseEnter() {
      setVisible(true);
    }

    function animateRing() {
      currentRingX += (targetX - currentRingX) * 0.18;
      currentRingY += (targetY - currentRingY) * 0.18;

      setRingPosition({
        x: currentRingX,
        y: currentRingY,
      });

      animationFrameId = window.requestAnimationFrame(animateRing);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    animationFrameId = window.requestAnimationFrame(animateRing);

    return () => {
      document.documentElement.classList.remove(
        "custom-cursor-enabled"
      );

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);

      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[5000] transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Smooth outer ring */}
      <div
        className={`
          fixed
          left-0
          top-0
          rounded-full
          border
          border-white/45
          bg-white/[0.025]
          shadow-[0_0_24px_rgba(255,255,255,0.08)]
          backdrop-blur-[1px]
          transition-[width,height,border-color,background-color]
          duration-200
          ${
            interactive
              ? "h-14 w-14 border-white/70 bg-white/[0.07]"
              : "h-9 w-9"
          }
          ${pressed ? "h-7 w-7" : ""}
        `}
        style={{
          transform: `translate3d(${ringPosition.x}px, ${ringPosition.y}px, 0) translate(-50%, -50%)`,
          willChange: "transform",
        }}
      />

      {/* Precise center dot */}
      <div
        className={`
          fixed
          left-0
          top-0
          rounded-full
          bg-white
          shadow-[0_0_14px_rgba(255,255,255,0.8)]
          transition-[width,height,background-color]
          duration-150
          ${
            interactive
              ? "h-[7px] w-[7px]"
              : "h-[5px] w-[5px]"
          }
        `}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
          willChange: "transform",
        }}
      />
    </div>
  );
}