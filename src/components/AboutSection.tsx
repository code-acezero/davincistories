import useScrollReveal from "@/hooks/useScrollReveal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AboutSection = () => {
  useScrollReveal();
  const { data: settings } = useQuery({
    queryKey: ["site-settings", "about-section"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*").in("key", ["about_description", "about_quote", "about_image"]);
      const map: Record<string, string> = {};
      data?.forEach((s) => { const v = s.value; map[s.key] = typeof v === "string" ? v : JSON.stringify(v).replace(/^"|"$/g, ""); });
      return map;
    },
  });

  return (
    <section id="about" className="py-20 md:py-28 relative overflow-hidden">
      <div className="container px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="reveal-up">
            <div className="glass-card rounded-3xl overflow-hidden">
              <img src={settings?.about_image || "/images/photo-banner.jpg"} alt="About DaVinci Stories" className="w-full aspect-[4/5] object-cover" loading="lazy" />
            </div>
          </div>
          <div className="reveal-up">
            <span className="text-primary text-sm uppercase tracking-[4px] font-medium mb-3 block">About Us</span>
            <h2 className="font-recoleta text-3xl md:text-4xl mb-6">Where Art Meets <span className="text-gradient-primary">Vision</span></h2>
            <p className="text-foreground/70 leading-relaxed mb-6">{settings?.about_description || "We are a passionate team of visual storytellers dedicated to capturing moments that transcend ordinary photography and videography."}</p>
            {settings?.about_quote && <blockquote className="pl-6 border-l-4 border-primary/50 italic text-foreground/60">"{settings.about_quote}"</blockquote>}
          </div>
        </div>
      </div>
    </section>
  );
};
export default AboutSection;
