import { useEffect, useRef, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import LiquidButton from "@/components/ui/LiquidButton";

const fallbackWords = [
  "Cinematography", "Photography", "Event Coverage", "Landscape Shots",
  "Wedding Shoots", "Outdoor Shoots", "Product Shoots",
];

const PARTICLE_COUNT = 30;

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    const interval = setInterval(() => setActiveIndex(prev => (prev + 1) % words.length), 3500);
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

  // Particle canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; pulse: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio > 1 ? 2 : 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio > 1 ? 2 : 1);
      ctx.scale(window.devicePixelRatio > 1 ? 2 : 1, window.devicePixelRatio > 1 ? 2 : 1);
    };
    resize();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(216, 75, 102, ${a})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(150, 188, 189, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const scrollToContent = () => {
    const el = sectionRef.current?.nextElementSibling;
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} id="home" className="relative h-screen flex items-center justify-center text-center overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video ref={videoRef} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-35 will-change-transform scale-110">
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(193 75% 7% / 0.5) 0%, hsl(193 79% 19% / 0.4) 40%, hsl(193 75% 7% / 0.95) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 40%, hsl(193 75% 7% / 0.6) 100%)" }} />
      </div>

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-[1] w-full h-full pointer-events-none" />

      {/* Floating orbs */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-primary/8 blur-[120px] top-[15%] right-[10%]" style={{ animation: "float 8s ease-in-out infinite" }} />
      <div className="absolute w-[200px] h-[200px] rounded-full bg-copper/8 blur-[80px] bottom-[25%] left-[12%]" style={{ animation: "float 6s ease-in-out infinite", animationDelay: "-3s" }} />

      <div className="container relative z-[2] px-4">
        <motion.img
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          src="/images/logo-banner.png"
          width={322} height={322}
          alt="DaVinci Stories"
          className="mx-auto max-w-[80px] md:max-w-[160px] mb-6 drop-shadow-2xl"
        />

        {/* Ink-writing headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-recoleta text-[12vw] sm:text-6xl md:text-7xl lg:text-8xl font-normal mb-4 tracking-tight leading-[1.15] pb-2 px-2"
        >
          <span className="ink-reveal inline-block pb-1">DaVinci </span>
          <span className="ink-stroke text-gradient-primary inline-block pb-1">Stories</span>
        </motion.h1>

        {/* Glass surface scratches/droplets */}
        <div className="glass-surface" aria-hidden />

        {/* Rotating words with typewriter effect */}
        <div className="relative h-[1.8em] my-4 md:my-6 overflow-visible">
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
              className="absolute left-1/2 -translate-x-1/2 top-0 font-recoleta italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light whitespace-nowrap leading-[1.4] px-4"
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
          A diary written in light & water
        </motion.p>

        {/* Liquid CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <LiquidButton to="/gallery" variant="primary" size="md">
            View Our Work
          </LiquidButton>
          <LiquidButton to="/booking" variant="ghost" size="md">
            Book a Session
          </LiquidButton>
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
