import useScrollReveal from "@/hooks/useScrollReveal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const TeamSection = () => {
  useScrollReveal();
  const [activeMember, setActiveMember] = useState<string | null>(null);
  const { data: members } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => { const { data } = await supabase.from("team_members").select("*").eq("is_visible", true).order("display_order"); return data ?? []; },
  });
  if (!members || members.length === 0) return null;
  const active = members.find(m => m.id === activeMember);

  return (
    <section id="team" className="py-20 md:py-28">
      <div className="container px-4">
        <div className="text-center mb-12 reveal-up">
          <span className="text-primary text-sm uppercase tracking-[4px] font-medium mb-3 block">The Crew</span>
          <h2 className="font-recoleta text-3xl md:text-4xl">Meet Our <span className="text-gradient-teal">Team</span></h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {members.map((member, i) => (
            <div key={member.id} className="reveal-up cursor-pointer group" style={{ transitionDelay: `${i * 0.1}s` }} onClick={() => setActiveMember(member.id)}>
              <div className="glass-card rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500">
                <div className="aspect-[3/4] overflow-hidden"><img src={member.photo_url || "/placeholder.svg"} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" /></div>
                <div className="p-5 text-center"><h3 className="font-recoleta text-xl mb-1">{member.name}</h3><p className="text-sm text-muted-foreground">{member.role}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 px-4" onClick={() => setActiveMember(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card-strong rounded-3xl p-8 max-w-md w-full relative" onClick={e => e.stopPropagation()}>
              <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" onClick={() => setActiveMember(null)}><X size={20} /></button>
              <img src={active.photo_alt_url || active.photo_url || "/placeholder.svg"} alt={active.name} className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-2 border-primary/30" />
              <h3 className="font-recoleta text-2xl text-center mb-1">{active.name}</h3>
              <p className="text-center text-primary text-sm mb-4">{active.role}</p>
              <p className="text-foreground/70 text-center">{active.bio || "Creative visionary."}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
export default TeamSection;
