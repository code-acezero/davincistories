import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

const BeforeAfterSlider = ({ before, after, beforeLabel = "Before", afterLabel = "After", className = "" }: BeforeAfterSliderProps) => {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    updatePosition(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [updatePosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  }, [isDragging, updatePosition]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl select-none touch-none cursor-ew-resize ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* After image (full background) */}
      <img src={after} alt={afterLabel} className="w-full h-full object-cover" draggable={false} />

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img src={before} alt={beforeLabel} className="w-full h-full object-cover" draggable={false} />
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-[3px] -translate-x-1/2 z-10"
        style={{ left: `${position}%`, background: "var(--gradient-primary)" }}
      >
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-card-strong flex items-center justify-center shadow-lg">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-4 rounded-full bg-primary" />
            <div className="w-0.5 h-4 rounded-full bg-primary" />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 z-10">
        <span className="glass-card-strong text-xs px-3 py-1.5 rounded-full font-medium tracking-wide uppercase">{beforeLabel}</span>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <span className="glass-card-strong text-xs px-3 py-1.5 rounded-full font-medium tracking-wide uppercase">{afterLabel}</span>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
