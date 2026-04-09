import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Camera, Users, Award, Heart } from "lucide-react";

const stats = [
  { icon: Camera, value: 500, suffix: "+", label: "Projects Completed" },
  { icon: Users, value: 150, suffix: "+", label: "Happy Clients" },
  { icon: Award, value: 8, suffix: "", label: "Years Experience" },
  { icon: Heart, value: 50, suffix: "K+", label: "Photos Delivered" },
];

const AnimatedNumber = ({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span>{count}{suffix}</span>;
};

const StatsCounter = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent, hsl(193 60% 10% / 0.5), transparent)" }} />
      <div className="container px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl glass-card mx-auto mb-4 flex items-center justify-center">
                  <Icon size={24} className="text-primary" />
                </div>
                <div className="font-recoleta text-3xl md:text-4xl mb-1">
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} inView={inView} />
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
