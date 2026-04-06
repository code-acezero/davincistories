import { useEffect, useRef, useState, useCallback } from "react";

const words = [
  "Cinematography",
  "Photography",
  "Event Coverage",
  "Pacific Portraits",
  "Landscape Shots",
  "Wedding Shoots",
  "Outdoor Shoots",
  "Product Shoots",
];

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % words.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleScroll = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center text-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-70 will-change-transform"
        >
          <source src="/videos/intro.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="container relative z-[2]">
        <img
          src="/images/logo-banner.png"
          width={322}
          height={322}
          alt="DaVinci Stories"
          className="mx-auto max-w-[150px] md:max-w-[322px] mb-5"
        />

        <h1 className="font-recoleta text-4xl md:text-6xl font-normal">DaVinci Stories</h1>

        <div className="relative h-[1.2em] my-3 md:my-6 overflow-hidden">
          {words.map((word, i) => (
            <span
              key={word}
              className={`absolute left-1/2 -translate-x-1/2 font-recoleta text-[6vw] md:text-5xl font-light whitespace-nowrap transition-all duration-500 ${
                i === activeIndex ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
              }`}
            >
              {word}
            </span>
          ))}
        </div>

        <p className="text-sm font-light uppercase tracking-[5px]">
          Let's Make Your Imaginations Into Reality
        </p>
      </div>

      <img src="/images/hero-shape.svg" width={211} height={189} alt="" className="absolute bottom-0 left-0 hidden lg:block" />
    </section>
  );
};

export default HeroSection;
