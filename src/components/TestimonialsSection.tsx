import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  {
    name: "Fatima Rahman",
    role: "Bride",
    text: "DaVinci Stories captured our wedding in the most magical way possible. Every frame tells a story, every moment is preserved with such artistic beauty.",
    rating: 5,
  },
  {
    name: "Arif Hossain",
    role: "Business Owner",
    text: "Their product photography elevated our brand to a whole new level. The attention to detail and creative direction was exceptional.",
    rating: 5,
  },
  {
    name: "Nusrat Jahan",
    role: "Model",
    text: "Working with the DaVinci team is always a pleasure. They bring out the best in every shot with their unique artistic vision.",
    rating: 5,
  },
  {
    name: "Tanvir Ahmed",
    role: "Event Organizer",
    text: "From corporate events to intimate gatherings, DaVinci Stories has been our go-to team. Their cinematic approach sets them apart.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  useScrollReveal();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive(p => (p + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at 30% 50%, hsl(350 55% 32% / 0.12), transparent 60%)" }} />
      <div className="container px-4 relative z-10">
        <div className="text-center mb-14 reveal-up">
          <span className="text-primary text-sm uppercase tracking-[4px] font-medium mb-3 block">Testimonials</span>
          <h2 className="font-recoleta text-3xl md:text-4xl">What Our Clients <span className="text-gradient-primary">Say</span></h2>
        </div>

        <div className="max-w-3xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-3xl p-8 md:p-12 text-center"
            >
              <Quote size={32} className="text-primary/30 mx-auto mb-6" />
              <p className="text-foreground/80 text-lg md:text-xl leading-relaxed mb-8 italic font-light">
                "{testimonials[active].text}"
              </p>
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(testimonials[active].rating)].map((_, i) => (
                  <Star key={i} size={14} className="text-gold fill-gold" />
                ))}
              </div>
              <p className="font-recoleta text-lg">{testimonials[active].name}</p>
              <p className="text-sm text-muted-foreground">{testimonials[active].role}</p>
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          <button
            onClick={() => setActive(p => (p - 1 + testimonials.length) % testimonials.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-14 w-10 h-10 rounded-full glass-card flex items-center justify-center hover:border-primary/30 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setActive(p => (p + 1) % testimonials.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-14 w-10 h-10 rounded-full glass-card flex items-center justify-center hover:border-primary/30 transition-all"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-primary" : "bg-foreground/20"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
