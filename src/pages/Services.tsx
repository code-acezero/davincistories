import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const Services = () => {
  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*").eq("is_visible", true).order("display_order");
      return data ?? [];
    },
  });

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <section className="container px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-recoleta text-4xl md:text-5xl text-center mb-4">
            Our Services
          </motion.h1>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Professional photography and videography services tailored to your vision
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services?.map((service, i) => (
              <motion.div key={service.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-500">
                {service.image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img src={service.image_url} alt={service.title} className="img-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-recoleta text-xl mb-3">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                </div>
              </motion.div>
            ))}
            {(!services || services.length === 0) && (
              <p className="col-span-full text-center text-muted-foreground py-12">Services coming soon...</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Services;
