import { useMemo } from "react";
import { useLocation } from "react-router-dom";

/** Subtle SVG petal — tinted soft rose */
const Petal = ({ tint = "346 75% 55%" }: { tint?: string }) => (
  <svg viewBox="0 0 32 32" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id={`pg-${tint.replace(/\s|%/g, "")}`} cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor={`hsl(${tint} / 0.95)`} />
        <stop offset="60%" stopColor={`hsl(${tint} / 0.55)`} />
        <stop offset="100%" stopColor={`hsl(${tint} / 0.1)`} />
      </radialGradient>
    </defs>
    <path
      d="M16 1 C 22 8, 30 14, 24 24 C 20 30, 12 30, 8 24 C 2 14, 10 8, 16 1 Z"
      fill={`url(#pg-${tint.replace(/\s|%/g, "")})`}
    />
  </svg>
);

const PETALS = 14;

const UnderwaterBackground = () => {
  const { pathname } = useLocation();
  // Hide heavy decorative layer in admin to keep CMS clean & performant
  const hidden = pathname.startsWith("/master");

  const petals = useMemo(
    () =>
      Array.from({ length: PETALS }, (_, i) => {
        const left = Math.random() * 100;
        const delay = -Math.random() * 30;
        const duration = 22 + Math.random() * 24;
        const drift = (Math.random() - 0.5) * 200;
        const spin = (Math.random() - 0.5) * 720;
        const scale = 0.6 + Math.random() * 1.4;
        const tint = i % 4 === 0 ? "18 70% 55%" : i % 4 === 1 ? "36 50% 60%" : i % 4 === 2 ? "346 70% 50%" : "181 30% 60%";
        return { left, delay, duration, drift, spin, scale, tint, key: i };
      }),
    []
  );

  if (hidden) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
      {/* Animated underwater caustics light rays */}
      <div className="caustics-layer" />

      {/* Floating petals layer */}
      <div className="absolute inset-0">
        {petals.map((p) => (
          <span
            key={p.key}
            className="petal"
            style={
              {
                left: `${p.left}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                transform: `scale(${p.scale})`,
                ["--drift" as never]: `${p.drift}px`,
                ["--spin" as never]: `${p.spin}deg`,
              } as React.CSSProperties
            }
          >
            <Petal tint={p.tint} />
          </span>
        ))}
      </div>

      {/* Soft vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, hsl(193 75% 5% / 0.55) 100%)",
        }}
      />
    </div>
  );
};

export default UnderwaterBackground;
