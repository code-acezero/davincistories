import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onEnter: () => void;
}

const LoadingScreen = ({ onEnter }: LoadingScreenProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEntering, setIsEntering] = useState(false);
  const glassRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Mouse follow for glass tilt
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!glassRef.current || isLoading) return;
      const rect = glassRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      glassRef.current.style.transform = `perspective(1000px) rotateY(${x * 15}deg) rotateX(${-y * 15}deg)`;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [isLoading]);

  const handleEnter = useCallback(() => {
    setIsEntering(true);
    setTimeout(() => onEnter(), 800);
  }, [onEnter]);

  return (
    <AnimatePresence>
      {!isEntering && (
        <motion.div
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(193 75% 7%), hsl(193 79% 19%), hsl(193 75% 7%))" }}
        >
          {/* Animated background orbs */}
          <div className="absolute w-[400px] h-[400px] rounded-full bg-primary/15 blur-[100px] top-[10%] left-[20%]" style={{ animation: "float 8s ease-in-out infinite" }} />
          <div className="absolute w-[300px] h-[300px] rounded-full bg-secondary/20 blur-[80px] bottom-[15%] right-[15%]" style={{ animation: "float 10s ease-in-out infinite", animationDelay: "-4s" }} />
          <div className="absolute w-[200px] h-[200px] rounded-full bg-copper/15 blur-[60px] top-[50%] left-[60%]" style={{ animation: "float 6s ease-in-out infinite", animationDelay: "-2s" }} />

          {isLoading ? (
            /* Loading phase - liquid glass morphing shape */
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative flex flex-col items-center gap-6"
            >
              <div
                className="w-24 h-24 glass-card-strong flex items-center justify-center"
                style={{ animation: "liquid-morph 4s linear infinite" }}
              >
                <img src="/images/loader.svg" width={40} height={40} alt="loading" className="relative z-10" />
              </div>
              <p className="text-foreground/50 text-sm tracking-[4px] uppercase">Loading</p>
            </motion.div>
          ) : (
            /* Enter phase - liquid glass portal */
            <motion.div
              ref={glassRef}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              onClick={handleEnter}
              className="relative cursor-pointer group"
              style={{ transformStyle: "preserve-3d", transition: "transform 0.1s ease-out" }}
            >
              {/* The liquid glass shape */}
              <div
                className="w-[300px] h-[300px] md:w-[380px] md:h-[380px] glass-card-strong flex flex-col items-center justify-center p-8 text-center relative overflow-hidden"
                style={{
                  animation: "liquid-morph 8s linear infinite",
                  boxShadow: "20px 20px 60px rgba(0,0,0,0.4), inset 5px 5px 20px rgba(150,188,189,0.05)",
                }}
              >
                {/* Floating particles inside */}
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-foreground/30"
                    style={{
                      width: `${4 + i * 2}px`,
                      height: `${4 + i * 2}px`,
                      top: `${20 + i * 15}%`,
                      left: `${15 + i * 18}%`,
                      animation: `float ${3 + i}s ease-in-out infinite`,
                      animationDelay: `${i * 0.5}s`,
                      boxShadow: "0 0 10px rgba(150,188,189,0.5)",
                    }}
                  />
                ))}

                <img src="/images/logo.png" alt="DaVinci Stories" className="w-16 h-16 mb-4 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                <h2 className="font-recoleta text-2xl md:text-3xl relative z-10 mb-2">DaVinci Stories</h2>
                <p className="text-foreground/60 text-sm relative z-10 mb-6">Make Your Imaginations Into Reality</p>
                
                <div className="relative z-10 border border-foreground/20 rounded-full px-8 py-2.5 text-sm tracking-[3px] uppercase group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:shadow-[0_0_30px_hsl(346_85%_55%/0.4)]">
                  Enter
                </div>
              </div>

              {/* Glow ring */}
              <div className="absolute -inset-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: "radial-gradient(circle, hsl(346 85% 55% / 0.15) 0%, transparent 70%)" }} />
            </motion.div>
          )}

          {/* Bottom hint */}
          {!isLoading && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-8 text-foreground/40 text-sm font-recoleta tracking-wide"
            >
              🎧 Use headphones for better experience
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
