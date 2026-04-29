import { useEffect, useRef, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import LiquidButton from "@/components/ui/LiquidButton";
import { Gear, CompassRose, BotanicalCorner, InkDivider } from "@/components/ornaments/Ornaments";

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
        ctx.fillStyle = `rgba(75, 35, 20, ${a * 0.7})`;
        ctx.fill();
      });

      // Ink filaments connecting nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(120, 70, 35, ${0.10 * (1 - dist / 120)})`;
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
      {/* Cinematic video background — sepia-toned, vignetted */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-55 will-change-transform scale-110"
          style={{ filter: "sepia(0.35) contrast(1.05) saturate(0.8) brightness(0.85)" }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        {/* Aged-paper warm overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(38 35% 88% / 0.55) 0%, hsl(34 30% 70% / 0.55) 45%, hsl(28 35% 35% / 0.85) 100%)" }} />
        {/* Cinematic vignette */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 35%, hsl(25 35% 14% / 0.55) 100%)" }} />
        {/* Underwater light streak */}
        <div className="absolute inset-0 mix-blend-screen opacity-30" style={{ background: "radial-gradient(ellipse 60% 30% at 30% 10%, hsl(195 50% 70% / 0.45), transparent 60%)" }} />
      </div>

      {/* Ink-dust particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-[1] w-full h-full pointer-events-none" />

      {/* Soft warm glow orbs (oil lamps through fog) */}
      <div className="absolute w-[300px] h-[300px] rounded-full blur-[120px] top-[15%] right-[10%]" style={{ background: "hsl(42 65% 50% / 0.18)", animation: "float 8s ease-in-out infinite" }} />
      <div className="absolute w-[200px] h-[200px] rounded-full blur-[80px] bottom-[25%] left-[12%]" style={{ background: "hsl(350 55% 32% / 0.18)", animation: "float 6s ease-in-out infinite", animationDelay: "-3s" }} />

      {/* Botanical corner vines (page edges) */}
      <BotanicalCorner className="absolute top-24 left-6 z-[2] opacity-70" size={140} color="hsl(38 50% 75%)" />
      <BotanicalCorner className="absolute top-24 right-6 z-[2] opacity-70" size={140} flip color="hsl(38 50% 75%)" />
      <BotanicalCorner className="absolute bottom-24 left-6 z-[2] opacity-60" size={120} flipY color="hsl(38 50% 75%)" />
      <BotanicalCorner className="absolute bottom-24 right-6 z-[2] opacity-60" size={120} flip flipY color="hsl(38 50% 75%)" />

      {/* Slow rotating gear in upper-left corner — cinematic clockwork */}
      <div className="absolute top-32 left-12 z-[2] opacity-30 hidden md:block">
        <Gear size={86} teeth={14} spin="slow" />
      </div>
      <div className="absolute bottom-32 right-12 z-[2] opacity-25 hidden md:block">
        <Gear size={64} teeth={10} spin="slow" reverse />
      </div>

      <div className="container relative z-[3] px-4">
        {/* Stamped eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 1 }}
          className="mb-4"
        >
          <span className="stamped-label">An Atelier of Light & Memory · Est. 2018</span>
        </motion.div>

        <motion.img
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          src="/images/logo-banner.png"
          width={322} height={322}
          alt="DaVinci Stories"
          className="mx-auto max-w-[80px] md:max-w-[150px] mb-5 drop-shadow-2xl"
          style={{ filter: "sepia(0.3) drop-shadow(0 4px 12px hsl(25 35% 14% / 0.4))" }}
        />

        {/* Calligraphy + ink-stroke headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-[12vw] sm:text-6xl md:text-7xl lg:text-8xl font-normal mb-2 tracking-tight leading-[1.15] pb-2 px-2"
        >
          <span className="ink-headline ink-reveal inline-block pb-1">DaVinci </span>
          <span className="calligraphy ink-stroke inline-block pb-1 italic" style={{ fontSize: "1.05em" }}>Stories</span>
        </motion.h1>

        {/* Engraved divider */}
        <InkDivider className="max-w-md mx-auto my-3" glyph="✦" />

        {/* Rotating discipline word */}
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
              className="absolute left-1/2 -translate-x-1/2 top-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light italic whitespace-nowrap leading-[1.4] px-4"
              style={{ color: "hsl(var(--burgundy))", fontFamily: "Cormorant Garamond, serif" }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="stamped-label mt-2"
          style={{ fontSize: "0.7rem" }}
        >
          A diary written in light & water
        </motion.p>

        {/* Liquid CTA buttons (now brass+ink in public scope) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <LiquidButton to="/gallery" variant="primary" size="md">
            View the Atelier
          </LiquidButton>
          <LiquidButton to="/booking" variant="ghost" size="md">
            Reserve a Sitting
          </LiquidButton>
        </motion.div>
      </div>

      {/* Compass scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={scrollToContent}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[hsl(var(--brass-dark))] hover:text-[hsl(var(--burgundy))] transition-colors group z-[3]"
      >
        <CompassRose size={44} className="opacity-80 group-hover:opacity-100 transition-opacity" />
        <span className="stamped-label" style={{ fontSize: "0.6rem" }}>Descend</span>
      </motion.button>
    </section>
  );
};

export default HeroSection;
