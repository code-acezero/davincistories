import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageSquare, Palette, Camera, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  { icon: MessageSquare, title: "Consultation", description: "We discuss your vision, style preferences, and plan every detail of your shoot." },
  { icon: Palette, title: "Creative Direction", description: "Our team designs mood boards, selects locations, and crafts the perfect visual narrative." },
  { icon: Camera, title: "The Shoot", description: "Magic happens! We capture your moments with our signature artistic approach." },
  { icon: Sparkles, title: "Delivery", description: "Expertly edited photos and films delivered through your private online gallery." },
];

const ProcessTimeline = () => {
  useScrollReveal();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-20 md:py-28 relative overflow-hidden">
      <div className="container px-4">
        <div className="text-center mb-16 reveal-up">
          <span className="text-primary text-sm uppercase tracking-[4px] font-medium mb-3 block">How It Works</span>
          <h2 className="font-recoleta text-3xl md:text-4xl">Our <span className="text-gradient-teal">Process</span></h2>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.2 }}
                className={`relative flex items-start gap-6 mb-12 md:mb-16 ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className={`flex-1 pl-16 md:pl-0 ${isLeft ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}>
                  <h3 className="font-recoleta text-xl mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>

                {/* Center dot */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full glass-card-strong flex items-center justify-center z-10 shrink-0">
                  <Icon size={20} className="text-primary" />
                </div>

                {/* Spacer for other side */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
