"use client";

const drops = Array.from({ length: 80 }, (_, i) => ({
  left: (i * 13) % 100,
  delay: (i % 10) * 0.3,
  duration: 0.7 + ((i % 5) * 0.15),
}));

export default function Rain() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {drops.map((drop, i) => (
        <span
          key={i}
          className="rain-drop absolute top-[-20%] h-20 w-[1px] bg-white/20"
          style={{
            left: `${drop.left}%`,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
          }}
        />
      ))}
    </div>
  );
}