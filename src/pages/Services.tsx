import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const OG_IMAGE = "https://davincistories.lovable.app/images/og-cover.jpg";

const Services = () => {
  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*").eq("is_visible", true).order("display_order");
      return data ?? [];
    },
  });

  return (
    <PageTransition>
      <Helmet>
        <title>Services — DaVinci Stories</title>
        <meta name="description" content="Explore DaVinci Stories professional photography and videography services — weddings, portraits, events, product shoots, and cinematic storytelling." />
        <link rel="canonical" href="https://davincistories.lovable.app/services" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Services — DaVinci Stories" />
        <meta property="og:description" content="Professional photography and videography services tailored to your vision." />
        <meta property="og:url" content="https://davincistories.lovable.app/services" />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Services — DaVinci Stories" />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Helmet>
      <Header />
      <main className="pt-24 pb-20">
        <section className="container px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-recoleta text-4xl md:text-6xl text-center mb-4">
            Our <span className="text-gradient-primary">Services</span>
          </motion.h1>
          <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
            Professional photography and videography services tailored to your vision
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services?.map((service, i) => (
              <motion.div key={service.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 flex flex-col">
                {service.image_url && (
                  <div className="aspect-video overflow-hidden relative">
                    <img src={service.image_url} alt={service.title} className="img-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-recoleta text-xl mb-3">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">{service.description}</p>
                  <Link to="/booking" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:gap-2 transition-all">
                    Book Now <ArrowRight size={14} />
                  </Link>
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
    </PageTransition>
  );
};

export default Services;
