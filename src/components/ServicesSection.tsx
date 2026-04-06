import useScrollReveal from "@/hooks/useScrollReveal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const ServicesSection = () => {
  useScrollReveal();
  const { data: services } = useQuery({
    queryKey: ["services-home"],
    queryFn: async () => { const { data } = await supabase.from("services").select("*").eq("is_visible", true).order("display_order").limit(4); return data ?? []; },
  });
  if (!services || services.length === 0) return null;
  return (
    <section id="services" className="py-20 md:py-28">
      <div className="container px-4">
        <div className="text-center mb-12 reveal-up">
          <span className="text-primary text-sm uppercase tracking-[4px] font-medium mb-3 block">What We Offer</span>
          <h2 className="font-recoleta text-3xl md:text-4xl">Our <span className="text-gradient-primary">Services</span></h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {services.map((service, i) => (
            <div key={service.id} className="reveal-up" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="glass-card rounded-2xl overflow-hidden group flex flex-col sm:flex-row h-full hover:border-primary/30 transition-all duration-500">
                {service.image_url && <div className="sm:w-2/5 aspect-video sm:aspect-auto overflow-hidden"><img src={service.image_url} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" /></div>}
                <div className="flex-1 p-6 flex flex-col justify-center"><h3 className="font-recoleta text-xl mb-2">{service.title}</h3><p className="text-sm text-muted-foreground">{service.description}</p></div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10 reveal-up"><Link to="/services" className="inline-block border border-primary/50 text-primary rounded-xl px-8 py-3 text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300 btn-glow">View All Services</Link></div>
      </div>
    </section>
  );
};
export default ServicesSection;
