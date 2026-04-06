import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "enter" | "exiting">("loading");
  const glassRef = useRef<HTMLDivElement>(null);

  // Simulate load progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setPhase("enter");
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Mouse follow tilt on enter phase
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!glassRef.current || phase !== "enter") return;
      const rect = glassRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      glassRef.current.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [phase]);

  const handleEnter = useCallback(() => {
    setPhase("exiting");
    setTimeout(() => {
      sessionStorage.setItem("davinci-entered", "true");
      onComplete();
      window.dispatchEvent(new Event("davinci-enter"));
    }, 800);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exiting" || true ? (
        <motion.div
          key="loading-screen"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8 }}
          className={`fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden ${phase === "exiting" ? "pointer-events-none" : ""}`}
          style={{ background: "linear-gradient(135deg, hsl(193 75% 7%), hsl(193 79% 14%), hsl(193 75% 7%))" }}
        >
          {/* Animated orbs */}
          <div className="absolute w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px] top-[10%] left-[20%]" style={{ animation: "float 8s ease-in-out infinite" }} />
          <div className="absolute w-[300px] h-[300px] rounded-full bg-secondary/15 blur-[80px] bottom-[15%] right-[15%]" style={{ animation: "float 10s ease-in-out infinite", animationDelay: "-4s" }} />
          <div className="absolute w-[200px] h-[200px] rounded-full bg-copper/10 blur-[60px] top-[50%] left-[60%]" style={{ animation: "float 6s ease-in-out infinite", animationDelay: "-2s" }} />

          {/* Particle field */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-foreground/20"
              style={{
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}

          {phase === "loading" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative flex flex-col items-center gap-8"
            >
              {/* Morphing loader */}
              <div
                className="w-28 h-28 glass-card-strong flex items-center justify-center relative"
                style={{ animation: "liquid-morph 4s linear infinite" }}
              >
                <img src="/images/loader.svg" width={44} height={44} alt="loading" className="relative z-10" />
                {/* Inner shimmer */}
                <div className="absolute inset-0 rounded-[inherit]" style={{ background: "linear-gradient(90deg, transparent 30%, rgba(150,188,189,0.08) 50%, transparent 70%)", animation: "shimmer 2s infinite" }} />
              </div>
              
              {/* Progress bar */}
              <div className="w-48 h-[2px] bg-foreground/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "var(--gradient-primary)" }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-foreground/40 text-xs tracking-[5px] uppercase">
                {Math.min(Math.round(progress), 100)}%
              </p>
            </motion.div>
          ) : phase === "enter" ? (
            <motion.div
              ref={glassRef}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              onClick={handleEnter}
              className="relative cursor-pointer group"
              style={{ transformStyle: "preserve-3d", transition: "transform 0.1s ease-out" }}
            >
              <div
                className="w-[280px] h-[280px] md:w-[360px] md:h-[360px] glass-card-strong flex flex-col items-center justify-center p-8 text-center relative overflow-hidden"
                style={{
                  animation: "liquid-morph 8s linear infinite",
                  boxShadow: "20px 20px 60px rgba(0,0,0,0.4), inset 5px 5px 20px rgba(150,188,189,0.05)",
                }}
              >
                {/* Floating particles inside */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-foreground/20"
                    style={{
                      width: `${3 + i * 1.5}px`,
                      height: `${3 + i * 1.5}px`,
                      top: `${20 + i * 12}%`,
                      left: `${10 + i * 16}%`,
                      animation: `float ${3 + i}s ease-in-out infinite`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  />
                ))}

                <img src="/images/logo.png" alt="DaVinci Stories" className="w-16 h-16 mb-4 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                <h2 className="font-recoleta text-2xl md:text-3xl relative z-10 mb-2">DaVinci Stories</h2>
                <p className="text-foreground/50 text-sm relative z-10 mb-6">Make Your Imaginations Into Reality</p>

                <div className="relative z-10 border border-foreground/20 rounded-full px-8 py-2.5 text-sm tracking-[3px] uppercase group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:shadow-[0_0_30px_hsl(346_85%_55%/0.4)]">
                  Enter
                </div>
              </div>

              {/* Glow ring */}
              <div className="absolute -inset-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: "radial-gradient(circle, hsl(346 85% 55% / 0.15) 0%, transparent 70%)" }} />
            </motion.div>
          ) : null}

          {/* Bottom hint */}
          {phase === "enter" && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-8 text-foreground/30 text-xs font-gordita tracking-wide"
            >
              🎧 Use headphones for better experience
            </motion.p>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default LoadingScreen;
