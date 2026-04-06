import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const fallbackWords = [
  "Cinematography", "Photography", "Event Coverage", "Landscape Shots",
  "Wedding Shoots", "Outdoor Shoots", "Product Shoots",
];

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { data: slides } = useQuery({
    queryKey: ["hero-slides"],
    queryFn: async () => {
      const { data } = await supabase.from("hero_slides").select("*").eq("is_visible", true).order("display_order");
      return data ?? [];
    },
  });

  const words = slides && slides.length > 0 ? slides.map(s => s.title) : fallbackWords;
  const videoUrl = slides?.[0]?.video_url || "/videos/intro.mp4";

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % words.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [words.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (videoRef.current) {
        videoRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center text-center overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video ref={videoRef} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-50 will-change-transform">
          <source src={videoUrl} type="video/mp4" />
        </video>
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(193 75% 7% / 0.4) 0%, hsl(193 79% 19% / 0.6) 50%, hsl(193 75% 7% / 0.9) 100%)" }} />
      </div>

      {/* Floating orbs */}
      <div className="absolute w-[200px] h-[200px] rounded-full bg-primary/10 blur-[80px] top-[20%] right-[10%]" style={{ animation: "float 8s ease-in-out infinite" }} />
      <div className="absolute w-[150px] h-[150px] rounded-full bg-copper/10 blur-[60px] bottom-[30%] left-[15%]" style={{ animation: "float 6s ease-in-out infinite", animationDelay: "-3s" }} />

      <div className="container relative z-[2] px-4">
        <motion.img
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          src="/images/logo-banner.png"
          width={322}
          height={322}
          alt="DaVinci Stories"
          className="mx-auto max-w-[120px] md:max-w-[250px] mb-6"
        />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-recoleta text-4xl md:text-7xl font-normal mb-4"
        >
          DaVinci <span className="text-gradient-primary">Stories</span>
        </motion.h1>

        <div className="relative h-[1.4em] my-4 md:my-6 overflow-hidden">
          {words.map((word, i) => (
            <span
              key={word}
              className={`absolute left-1/2 -translate-x-1/2 font-recoleta text-[5vw] md:text-4xl font-light whitespace-nowrap transition-all duration-700 ${
                i === activeIndex ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
              }`}
              style={{ color: "hsl(var(--ocean-teal))" }}
            >
              {word}
            </span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm font-light uppercase tracking-[5px] text-foreground/60"
        >
          Let's Make Your Imaginations Into Reality
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex justify-center pt-2">
            <div className="w-1 h-3 rounded-full bg-primary animate-bounce" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
