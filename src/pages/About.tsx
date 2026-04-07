import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const About = () => {
  const { data: settings } = useQuery({
    queryKey: ["site-settings", "about"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*").in("key", ["about_title", "about_description", "about_image", "about_quote", "about_signature"]);
      const map: Record<string, string> = {};
      data?.forEach((s) => { map[s.key] = typeof s.value === 'string' ? s.value : JSON.stringify(s.value); });
      return map;
    },
  });

  const title = settings?.about_title || "About DaVinci Stories";

  return (
    <PageTransition>
      <Helmet>
        <title>{title} — DaVinci Stories</title>
        <meta name="description" content="Learn about DaVinci Stories — a creative photography and videography team from Bangladesh dedicated to turning your imagination into reality." />
        <link rel="canonical" href="https://davincistories.lovable.app/about" />
        <meta property="og:title" content={`${title} — DaVinci Stories`} />
        <meta property="og:url" content="https://davincistories.lovable.app/about" />
      </Helmet>
      <Header />
      <main className="pt-24 pb-20">
        <section className="container max-w-4xl mx-auto px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-recoleta text-4xl md:text-5xl text-center mb-8">
            {title}
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-8 md:p-12">
            {settings?.about_image && (
              <img src={settings.about_image} alt="About DaVinci Stories" className="w-full rounded-xl mb-8 img-cover max-h-[400px]" />
            )}
            <p className="text-foreground/80 text-lg leading-relaxed whitespace-pre-wrap">
              {settings?.about_description || "DaVinci Stories is a creative photography and videography team dedicated to turning your imagination into reality. We specialize in capturing moments that tell compelling stories through our lens."}
            </p>
            {settings?.about_quote && (
              <blockquote className="mt-8 pl-6 border-l-4 border-primary italic text-foreground/70 text-lg">
                {settings.about_quote}
              </blockquote>
            )}
          </motion.div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default About;
