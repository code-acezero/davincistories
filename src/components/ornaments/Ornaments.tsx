/**
 * Ornament primitives — engraved brass, gears, vines, compass, ink.
 * Pure SVG, no external deps. Use sparingly as decorative framing.
 */
import { type SVGProps } from "react";

const brassStops = (
  <>
    <stop offset="0%" stopColor="hsl(32 50% 28%)" />
    <stop offset="35%" stopColor="hsl(38 60% 52%)" />
    <stop offset="55%" stopColor="hsl(42 78% 68%)" />
    <stop offset="75%" stopColor="hsl(38 60% 50%)" />
    <stop offset="100%" stopColor="hsl(32 50% 26%)" />
  </>
);

/* ---------- Gear ---------- */
export const Gear = ({
  size = 48,
  teeth = 12,
  spin = "slow",
  reverse = false,
  className = "",
  ...rest
}: SVGProps<SVGSVGElement> & { size?: number; teeth?: number; spin?: "slow" | "fast" | "off"; reverse?: boolean }) => {
  const r = 50;
  const inner = 36;
  const toothLen = 9;
  const toothW = 6;
  const teethArr = Array.from({ length: teeth }, (_, i) => (i / teeth) * 360);
  const cls =
    spin === "off" ? "" : reverse ? "gear-spin-rev" : "gear-spin";
  const slow = spin === "slow" ? "gear-slow" : "";
  const id = `gear-${teeth}-${reverse ? "r" : "f"}`;
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={`${cls} ${slow} ${className}`}
      aria-hidden
      {...rest}
    >
      <defs>
        <radialGradient id={id} cx="50%" cy="40%" r="60%">{brassStops}</radialGradient>
      </defs>
      <g transform="translate(60 60)">
        {teethArr.map((deg) => (
          <rect
            key={deg}
            x={-toothW / 2}
            y={-(r + toothLen)}
            width={toothW}
            height={toothLen + 2}
            rx={1}
            fill={`url(#${id})`}
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r={r} fill={`url(#${id})`} stroke="hsl(28 45% 18%)" strokeWidth="1.2" />
        <circle r={inner} fill="hsl(34 30% 78%)" stroke="hsl(28 45% 22%)" strokeWidth="1" />
        {/* spokes */}
        {[0, 60, 120].map((deg) => (
          <rect
            key={deg}
            x={-2.5}
            y={-inner + 4}
            width={5}
            height={(inner - 8) * 2}
            rx={2}
            fill={`url(#${id})`}
            transform={`rotate(${deg})`}
            opacity={0.85}
          />
        ))}
        <circle r={8} fill={`url(#${id})`} stroke="hsl(28 45% 18%)" strokeWidth="1" />
        <circle r={3} fill="hsl(28 45% 14%)" />
      </g>
    </svg>
  );
};

/* ---------- Compass rose ---------- */
export const CompassRose = ({ size = 80, className = "" }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
    <defs>
      <linearGradient id="cr-brass" x1="0" y1="0" x2="1" y2="1">{brassStops}</linearGradient>
    </defs>
    <circle cx="50" cy="50" r="46" fill="none" stroke="url(#cr-brass)" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(28 45% 22%)" strokeWidth="0.5" strokeDasharray="1 3" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
      const major = deg % 90 === 0;
      return (
        <g key={deg} transform={`rotate(${deg} 50 50)`}>
          <polygon
            points={major ? "50,8 53,50 50,52 47,50" : "50,18 51.5,50 50,51 48.5,50"}
            fill="url(#cr-brass)"
            stroke="hsl(28 45% 18%)"
            strokeWidth="0.4"
          />
        </g>
      );
    })}
    <circle cx="50" cy="50" r="5" fill="url(#cr-brass)" stroke="hsl(28 45% 18%)" strokeWidth="0.6" />
    <circle cx="50" cy="50" r="1.6" fill="hsl(28 45% 14%)" />
  </svg>
);

/* ---------- Botanical corner (hand-drawn vine) ---------- */
export const BotanicalCorner = ({
  size = 110,
  flip = false,
  flipY = false,
  className = "",
  color = "hsl(145 28% 22%)",
}: {
  size?: number;
  flip?: boolean;
  flipY?: boolean;
  className?: string;
  color?: string;
}) => (
  <svg
    viewBox="0 0 120 120"
    width={size}
    height={size}
    className={className}
    style={{ transform: `scale(${flip ? -1 : 1}, ${flipY ? -1 : 1})` }}
    aria-hidden
  >
    <g fill="none" stroke={color} strokeWidth="1.1" strokeLinecap="round">
      {/* main vine */}
      <path d="M6 6 C 22 22, 44 30, 60 50 S 95 78, 114 114" opacity="0.85" />
      {/* small curl */}
      <path d="M28 18 c 6 -2, 12 2, 10 8 s -10 4, -10 -2" opacity="0.7" />
      <path d="M52 38 c 8 -3, 16 3, 13 11 s -13 5, -13 -3" opacity="0.7" />
      {/* leaves */}
      <path d="M36 28 q 8 -10, 18 -4 q -4 12, -18 4 z" fill={color} fillOpacity="0.18" />
      <path d="M64 56 q 10 -8, 20 -2 q -4 12, -20 2 z" fill={color} fillOpacity="0.18" />
      <path d="M88 84 q 10 -10, 20 -4 q -2 14, -20 4 z" fill={color} fillOpacity="0.18" />
      {/* rose hint */}
      <circle cx="44" cy="30" r="3.5" fill="hsl(350 55% 32%)" fillOpacity="0.55" />
      <circle cx="44" cy="30" r="1.5" fill="hsl(350 55% 22%)" />
      <circle cx="92" cy="80" r="2.8" fill="hsl(350 55% 32%)" fillOpacity="0.5" />
    </g>
  </svg>
);

/* ---------- Engraved brass frame around children ---------- */
export const BrassFrame = ({
  children,
  className = "",
  cornerSize = 28,
}: {
  children: React.ReactNode;
  className?: string;
  cornerSize?: number;
}) => (
  <div className={`relative ${className}`}>
    {(["tl", "tr", "bl", "br"] as const).map((pos) => (
      <span
        key={pos}
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          width: cornerSize,
          height: cornerSize,
          top: pos.startsWith("t") ? -1 : "auto",
          bottom: pos.startsWith("b") ? -1 : "auto",
          left: pos.endsWith("l") ? -1 : "auto",
          right: pos.endsWith("r") ? -1 : "auto",
        }}
      >
        <svg viewBox="0 0 28 28" width={cornerSize} height={cornerSize}>
          <defs>
            <linearGradient id={`bf-${pos}`} x1="0" y1="0" x2="1" y2="1">{brassStops}</linearGradient>
          </defs>
          <g
            stroke={`url(#bf-${pos})`}
            strokeWidth="1.6"
            fill="none"
            transform={
              pos === "tl" ? "" :
              pos === "tr" ? "translate(28 0) scale(-1 1)" :
              pos === "bl" ? "translate(0 28) scale(1 -1)" :
              "translate(28 28) scale(-1 -1)"
            }
          >
            <path d="M0 14 L0 4 Q0 0 4 0 L14 0" />
            <path d="M0 18 L0 6 Q0 2 6 2 L18 2" opacity="0.55" />
            <circle cx="4" cy="4" r="1.5" fill={`url(#bf-${pos})`} />
          </g>
        </svg>
      </span>
    ))}
    {children}
  </div>
);

/* ---------- Ink divider with central ornament ---------- */
export const InkDivider = ({ className = "", glyph = "❦" }: { className?: string; glyph?: string }) => (
  <div className={`flex items-center gap-4 ${className}`} aria-hidden>
    <span className="flex-1 h-px bg-gradient-to-r from-transparent via-[hsl(var(--brass-dark))] to-transparent" />
    <span className="text-[hsl(var(--brass-dark))] text-lg font-serif select-none">{glyph}</span>
    <span className="flex-1 h-px bg-gradient-to-r from-transparent via-[hsl(var(--brass-dark))] to-transparent" />
  </div>
);

/* ---------- Pressure valve (decorative) ---------- */
export const PressureValve = ({ size = 40, className = "" }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 60 60" width={size} height={size} className={className} aria-hidden>
    <defs>
      <radialGradient id="pv" cx="40%" cy="35%" r="65%">{brassStops}</radialGradient>
    </defs>
    <circle cx="30" cy="30" r="22" fill="url(#pv)" stroke="hsl(28 45% 18%)" strokeWidth="1" />
    <circle cx="30" cy="30" r="14" fill="hsl(34 30% 76%)" stroke="hsl(28 45% 22%)" strokeWidth="0.8" />
    {Array.from({ length: 24 }).map((_, i) => (
      <line key={i} x1="30" y1="9" x2="30" y2="12" stroke="hsl(28 45% 18%)" strokeWidth="0.6"
        transform={`rotate(${i * 15} 30 30)`} />
    ))}
    {/* needle */}
    <line x1="30" y1="30" x2="40" y2="20" stroke="hsl(350 55% 28%)" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="30" cy="30" r="2" fill="hsl(28 45% 14%)" />
  </svg>
);
