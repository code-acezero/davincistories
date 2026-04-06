import { useEffect, useRef } from "react";

export function useScrollReveal<T extends HTMLElement>(direction: "up" | "left" | "right" = "up") {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const className = direction === "left" ? "reveal-left" : direction === "right" ? "reveal-right" : "reveal-up";
    el.classList.add(className);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [direction]);

  return ref;
}
