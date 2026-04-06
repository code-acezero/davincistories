import { useEffect, useRef, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const fallbackWords = [
  "Cinematography", "Photography", "Event Coverage", "Landscape Shots",
  "Wedding Shoots", "Outdoor Shoots", "Product Shoots",
];

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { data: slides } = useQuery({
    queryKey: ["hero-slides"],
    queryFn: async () => {
      const { data } = await supabase.from("hero_slides").select("*").eq("is_visible", true).order("display_order");
      return data ?? [];
    },
  });

  const words = useMemo(() => slides && slides.length > 0 ? slides.map(s => s.title) : fallbackWords, [slides]);
  const videoUrl = slides?.[0]?.video_url || "/videos/intro.mp4";

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % words.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [words.length]);

  // Parallax scroll
  useEffect(() => {
    const handleScroll = () => {
      if (videoRef.current) {
        videoRef.current.style.transform = `translateY(${window.scrollY * 0.35}px) scale(1.1)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToContent = () => {
    const el = sectionRef.current?.nextElementSibling;
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} id="home" className="relative h-screen flex items-center justify-center text-center overflow-hidden">
      {/* Video background with parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          className="w-full h-full object-cover opacity-40 will-change-transform scale-110"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(193 75% 7% / 0.5) 0%, hsl(193 79% 19% / 0.4) 40%, hsl(193 75% 7% / 0.95) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 40%, hsl(193 75% 7% / 0.6) 100%)" }} />
      </div>

      {/* Floating orbs */}
      <div className="absolute w-[250px] h-[250px] rounded-full bg-primary/8 blur-[100px] top-[15%] right-[10%]" style={{ animation: "float 8s ease-in-out infinite" }} />
      <div className="absolute w-[180px] h-[180px] rounded-full bg-copper/8 blur-[70px] bottom-[25%] left-[12%]" style={{ animation: "float 6s ease-in-out infinite", animationDelay: "-3s" }} />
      <div className="absolute w-[120px] h-[120px] rounded-full bg-ocean-teal/10 blur-[50px] top-[60%] right-[30%]" style={{ animation: "float 10s ease-in-out infinite", animationDelay: "-5s" }} />

      <div className="container relative z-[2] px-4">
        <motion.img
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          src="/images/logo-banner.png"
          width={322}
          height={322}
          alt="DaVinci Stories"
          className="mx-auto max-w-[100px] md:max-w-[200px] mb-6 drop-shadow-2xl"
        />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-recoleta text-4xl md:text-7xl lg:text-8xl font-normal mb-2"
        >
          DaVinci <span className="text-gradient-primary">Stories</span>
        </motion.h1>

        {/* Rotating words */}
        <div className="relative h-[1.5em] my-4 md:my-6 overflow-hidden">
          {words.map((word, i) => (
            <motion.span
              key={word}
              initial={false}
              animate={{
                opacity: i === activeIndex ? 1 : 0,
                y: i === activeIndex ? 0 : 20,
                scale: i === activeIndex ? 1 : 0.9,
                filter: i === activeIndex ? "blur(0px)" : "blur(4px)",
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute left-1/2 -translate-x-1/2 font-recoleta text-[5vw] md:text-4xl lg:text-5xl font-light whitespace-nowrap"
              style={{ color: "hsl(var(--ocean-teal))" }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-xs md:text-sm font-light uppercase tracking-[5px] md:tracking-[8px] text-foreground/50 mt-2"
        >
          Let's Make Your Imaginations Into Reality
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <a href="/gallery" className="bg-primary text-primary-foreground rounded-full px-8 py-3 text-sm font-medium hover:opacity-90 transition-all btn-glow hover:-translate-y-0.5">
            View Our Work
          </a>
          <a href="/booking" className="border border-foreground/20 text-foreground rounded-full px-8 py-3 text-sm hover:border-primary hover:text-primary transition-all hover:-translate-y-0.5">
            Book a Session
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground/30 hover:text-primary transition-colors group"
      >
        <span className="text-[10px] uppercase tracking-[3px]">Scroll</span>
        <div className="w-6 h-10 rounded-full border border-foreground/20 flex justify-center pt-2 group-hover:border-primary/50 transition-colors">
          <div className="w-1 h-3 rounded-full bg-primary animate-bounce" />
        </div>
      </motion.button>
    </section>
  );
};

export default HeroSection;
