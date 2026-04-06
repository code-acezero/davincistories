import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    elements.forEach((el) => observer.observe(el));
    
    // Re-observe after lazy load
    const mutation = new MutationObserver(() => {
      document.querySelectorAll(".reveal-up:not(.revealed), .reveal-left:not(.revealed), .reveal-right:not(.revealed)")
        .forEach(el => observer.observe(el));
    });
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);
}

export default useScrollReveal;
