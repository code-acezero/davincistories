import { useMemo } from "react";
import { useLocation } from "react-router-dom";

/** Subtle SVG petal / leaf — rose, copper, forest, brass */
const Petal = ({ tint = "350 55% 32%", kind = "petal" }: { tint?: string; kind?: "petal" | "leaf" }) => {
  const id = `pg-${tint.replace(/\s|%/g, "")}-${kind}`;
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={id} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor={`hsl(${tint} / 0.9)`} />
          <stop offset="60%" stopColor={`hsl(${tint} / 0.5)`} />
          <stop offset="100%" stopColor={`hsl(${tint} / 0.05)`} />
        </radialGradient>
      </defs>
      {kind === "petal" ? (
        <path d="M16 1 C 22 8, 30 14, 24 24 C 20 30, 12 30, 8 24 C 2 14, 10 8, 16 1 Z" fill={`url(#${id})`} />
      ) : (
        <path d="M16 2 C 28 6, 30 22, 16 30 C 4 22, 4 6, 16 2 Z M16 4 L16 28" fill={`url(#${id})`} stroke={`hsl(${tint} / 0.6)`} strokeWidth="0.5" />
      )}
    </svg>
  );
};

const PETALS = 16;

const UnderwaterBackground = () => {
  const { pathname } = useLocation();
  // Hide heavy decorative layer in admin to keep CMS clean & performant
  const hidden = pathname.startsWith("/master");

  const petals = useMemo(
    () =>
      Array.from({ length: PETALS }, (_, i) => {
        const left = Math.random() * 100;
        const delay = -Math.random() * 30;
        const duration = 26 + Math.random() * 28;
        const drift = (Math.random() - 0.5) * 220;
        const spin = (Math.random() - 0.5) * 720;
        const scale = 0.6 + Math.random() * 1.2;
        // rose / copper / forest / brass / oxidized ink
        const palette = ["350 55% 32%", "24 65% 38%", "145 28% 24%", "42 65% 50%", "165 25% 38%"];
        const tint = palette[i % palette.length];
        const kind: "petal" | "leaf" = i % 3 === 0 ? "leaf" : "petal";
        return { left, delay, duration, drift, spin, scale, tint, kind, key: i };
      }),
    []
  );

  if (hidden) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
      {/* Warm caustics through water */}
      <div className="caustics-layer" />

      {/* Floating petals & leaves */}
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
            <Petal tint={p.tint} kind={p.kind} />
          </span>
        ))}
      </div>

      {/* Soft warm vignette (parchment edges) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, hsl(28 35% 30% / 0.35) 100%)",
        }}
      />
    </div>
  );
};

export default UnderwaterBackground;
