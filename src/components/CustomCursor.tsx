import { useEffect, useRef, useCallback } from "react";

const TRAIL_LENGTH = 12;

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const pos = useRef({ x: -100, y: -100 });
  const trailPositions = useRef(Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 })));
  const clickRipples = useRef<HTMLDivElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  const animate = useCallback(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
    }
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const prev = i === 0 ? pos.current : trailPositions.current[i - 1];
      const trail = trailPositions.current[i];
      const ease = 0.25 - i * 0.012;
      trail.x += (prev.x - trail.x) * ease;
      trail.y += (prev.y - trail.y) * ease;
      const el = trailRefs.current[i];
      if (el) {
        el.style.transform = `translate(${trail.x}px, ${trail.y}px) scale(${1 - i * 0.06})`;
        el.style.opacity = `${0.5 - i * 0.035}`;
      }
    }
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    document.body.style.cursor = "none";

    const handleMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const handleDown = () => {
      cursorRef.current?.classList.add("cursor-click");
      // Create click ripple
      if (containerRef.current) {
        const ripple = document.createElement("div");
        ripple.className = "click-ripple";
        ripple.style.left = `${pos.current.x}px`;
        ripple.style.top = `${pos.current.y}px`;
        containerRef.current.appendChild(ripple);
        clickRipples.current.push(ripple);
        setTimeout(() => {
          ripple.remove();
          clickRipples.current = clickRipples.current.filter(r => r !== ripple);
        }, 700);
      }
    };

    const handleUp = () => {
      cursorRef.current?.classList.remove("cursor-click");
    };

    const handleHover = () => {
      cursorRef.current?.classList.add("cursor-hover");
    };
    const handleLeave = () => {
      cursorRef.current?.classList.remove("cursor-hover");
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);

    // Add hover detection for links and buttons
    const addHoverListeners = () => {
      document.querySelectorAll("a, button, [role='button'], input, textarea, select").forEach(el => {
        el.addEventListener("mouseenter", handleHover);
        el.addEventListener("mouseleave", handleLeave);
      });
    };
    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  // Don't render on touch devices
  if (typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
    return null;
  }

  return (
    <div ref={containerRef} className="pointer-events-none fixed inset-0 z-[99999]">
      {/* Trail dots */}
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <div
          key={i}
          ref={el => { if (el) trailRefs.current[i] = el; }}
          className="custom-cursor-trail"
          style={{
            width: `${6 - i * 0.3}px`,
            height: `${6 - i * 0.3}px`,
          }}
        />
      ))}
      {/* Main cursor */}
      <div ref={cursorRef} className="custom-cursor-main" />
    </div>
  );
};

export default CustomCursor;
