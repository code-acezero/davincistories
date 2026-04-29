import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { BrassFrame, BotanicalCorner, InkDivider, Gear } from "@/components/ornaments/Ornaments";

const TeamSection = () => {
  useScrollReveal();
  const [activeMember, setActiveMember] = useState<string | null>(null);
  const { data: members } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data } = await supabase
        .from("team_members")
        .select("*")
        .eq("is_visible", true)
        .order("display_order");
      return data ?? [];
    },
  });
  if (!members || members.length === 0) return null;
  const active = members.find((m) => m.id === activeMember);

  return (
    <section id="team" className="py-20 md:py-28 relative">
      {/* corner ornaments */}
      <BotanicalCorner className="absolute top-6 left-4 opacity-50 hidden md:block" size={120} color="hsl(145 28% 30%)" />
      <BotanicalCorner className="absolute top-6 right-4 opacity-50 hidden md:block" flip size={120} color="hsl(145 28% 30%)" />

      <div className="container px-4 relative">
        <div className="text-center mb-14 reveal-up">
          <span className="section-eyebrow">— The Crew —</span>
          <h2 className="text-4xl md:text-5xl mt-3 mb-2 ink-headline">
            Our <span className="calligraphy italic" style={{ fontSize: "1.15em" }}>Atelier</span>
          </h2>
          <InkDivider className="max-w-xs mx-auto mt-4" glyph="❦" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {members.map((member, i) => (
            <div
              key={member.id}
              className="reveal-up cursor-pointer group"
              style={{ transitionDelay: `${i * 0.1}s` }}
              onClick={() => setActiveMember(member.id)}
            >
              {/* Identity card — paper sheet with engraved brass frame */}
              <div className="relative paper-sheet brass-frame p-3 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
                {/* Slow gear watermark */}
                <Gear
                  size={32}
                  teeth={10}
                  spin="slow"
                  className="absolute -top-3 -right-3 opacity-50 z-10"
                />

                {/* Cinematic photo */}
                <div className="aspect-[3/4] overflow-hidden relative photo-cinematic engraved-border">
                  <img
                    src={member.photo_url || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* underwater shimmer on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-screen"
                    style={{
                      background:
                        "linear-gradient(115deg, transparent 40%, hsl(195 60% 80% / 0.25) 50%, transparent 60%)",
                    }}
                  />
                </div>

                {/* Identity plate */}
                <div className="pt-5 pb-3 px-2 text-center relative">
                  <h3 className="calligraphy text-3xl leading-none mb-1">{member.name}</h3>
                  <span className="section-eyebrow block mt-2">{member.role}</span>
                  {member.bio && (
                    <p className="text-sm italic text-[hsl(var(--ink-soft))] mt-3 line-clamp-2 px-2 font-serif">
                      “{member.bio}”
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            style={{ background: "hsl(25 35% 14% / 0.7)", backdropFilter: "blur(4px)" }}
            onClick={() => setActiveMember(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              className="paper-sheet brass-frame p-8 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-[hsl(var(--ink-soft))] hover:text-[hsl(var(--burgundy))]"
                onClick={() => setActiveMember(null)}
              >
                <X size={20} />
              </button>
              <div className="photo-cinematic engraved-border w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src={active.photo_alt_url || active.photo_url || "/placeholder.svg"}
                  alt={active.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="calligraphy text-4xl text-center mb-1">{active.name}</h3>
              <span className="section-eyebrow block text-center">{active.role}</span>
              <InkDivider className="my-4" />
              <p className="text-[hsl(var(--ink-soft))] text-center italic font-serif leading-relaxed">
                {active.bio || "A creative visionary, weaving light into memory."}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TeamSection;
