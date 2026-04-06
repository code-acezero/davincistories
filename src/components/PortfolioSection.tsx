import useScrollReveal from "@/hooks/useScrollReveal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const PortfolioSection = () => {
  useScrollReveal();
  const { data: items } = useQuery({
    queryKey: ["portfolio-home"],
    queryFn: async () => { const { data } = await supabase.from("portfolio_items").select("*").eq("is_visible", true).order("display_order").limit(6); return data ?? []; },
  });
  if (!items || items.length === 0) return null;
  return (
    <section id="portfolio" className="py-20 md:py-28">
      <div className="container px-4">
        <div className="text-center mb-12 reveal-up">
          <span className="text-primary text-sm uppercase tracking-[4px] font-medium mb-3 block">Our Work</span>
          <h2 className="font-recoleta text-3xl md:text-4xl">Featured <span className="text-gradient-warm">Portfolio</span></h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {items.map((item, i) => (
            <div key={item.id} className="reveal-up" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="glass-card rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-500">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={item.image_url || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                    <div><h3 className="font-recoleta text-lg">{item.title}</h3>{item.category && <span className="text-xs text-primary/80">{item.category}</span>}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10 reveal-up"><Link to="/gallery" className="inline-block border border-primary/50 text-primary rounded-xl px-8 py-3 text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300 btn-glow">View Full Gallery</Link></div>
      </div>
    </section>
  );
};
export default PortfolioSection;
