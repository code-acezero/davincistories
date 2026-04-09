import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const OG_IMAGE = "https://davincistories.lovable.app/images/og-cover.jpg";

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

  const { data: team } = useQuery({
    queryKey: ["about-team"],
    queryFn: async () => { const { data } = await supabase.from("team_members").select("*").eq("is_visible", true).order("display_order").limit(4); return data ?? []; },
  });

  const title = settings?.about_title || "About DaVinci Stories";

  return (
    <PageTransition>
      <Helmet>
        <title>{title} — DaVinci Stories</title>
        <meta name="description" content="Learn about DaVinci Stories — a creative photography and videography team from Bangladesh dedicated to turning your imagination into reality." />
        <link rel="canonical" href="https://davincistories.lovable.app/about" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${title} — DaVinci Stories`} />
        <meta property="og:description" content="A creative photography and videography team from Bangladesh." />
        <meta property="og:url" content="https://davincistories.lovable.app/about" />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} — DaVinci Stories`} />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Helmet>
      <Header />
      <main className="pt-24 pb-20">
        {/* Hero section */}
        <section className="container max-w-5xl mx-auto px-4 mb-20">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-recoleta text-4xl md:text-6xl text-center mb-4">
            {title.includes("DaVinci") ? <>{title.split("DaVinci")[0]}DaVinci <span className="text-gradient-primary">Stories</span></> : title}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Where art meets vision — we're a passionate team dedicated to turning moments into masterpieces
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid md:grid-cols-2 gap-8 items-center">
            <div className="glass-card rounded-3xl overflow-hidden">
              <img src={settings?.about_image || "/images/photo-banner.jpg"} alt="About DaVinci Stories" className="w-full aspect-[4/5] object-cover" />
            </div>
            <div className="space-y-6">
              <p className="text-foreground/80 text-lg leading-relaxed whitespace-pre-wrap">
                {settings?.about_description || "DaVinci Stories is a creative photography and videography team dedicated to turning your imagination into reality. We specialize in capturing moments that tell compelling stories through our lens.\n\nFounded with a passion for visual storytelling, our team brings together diverse creative skills to deliver exceptional results for every project."}
              </p>
              {settings?.about_quote && (
                <blockquote className="pl-6 border-l-4 border-primary italic text-foreground/60 text-lg">
                  "{settings.about_quote}"
                </blockquote>
              )}
            </div>
          </motion.div>
        </section>

        {/* Team preview */}
        {team && team.length > 0 && (
          <section className="container px-4">
            <h2 className="font-recoleta text-2xl md:text-3xl text-center mb-10">The <span className="text-gradient-teal">Team</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {team.map((m, i) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center group">
                  <div className="glass-card rounded-2xl overflow-hidden mb-3">
                    <img src={m.photo_url || "/placeholder.svg"} alt={m.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  </div>
                  <h3 className="font-recoleta text-base">{m.name}</h3>
                  <p className="text-xs text-muted-foreground">{m.role}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </PageTransition>
  );
};

export default About;
