import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ url: string; index: number } | null>(null);

  const { data: categories } = useQuery({
    queryKey: ["gallery-categories"],
    queryFn: async () => { const { data } = await supabase.from("gallery_categories").select("*").order("display_order"); return data ?? []; },
  });

  const { data: images } = useQuery({
    queryKey: ["gallery-images", activeCategory],
    queryFn: async () => {
      let q = supabase.from("gallery_images").select("*").eq("is_visible", true).order("display_order");
      if (activeCategory) q = q.eq("category_id", activeCategory);
      const { data } = await q;
      return data ?? [];
    },
  });

  const navigateLightbox = (dir: number) => {
    if (!lightbox || !images) return;
    const newIdx = (lightbox.index + dir + images.length) % images.length;
    setLightbox({ url: images[newIdx].image_url, index: newIdx });
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Gallery — DaVinci Stories</title>
        <meta name="description" content="Browse the DaVinci Stories gallery — a curated collection of our best photography and videography work across weddings, portraits, events, and more." />
        <link rel="canonical" href="https://davincistories.lovable.app/gallery" />
        <meta property="og:title" content="Gallery — DaVinci Stories" />
        <meta property="og:url" content="https://davincistories.lovable.app/gallery" />
      </Helmet>
      <Header />
      <main className="pt-24 pb-20">
        <section className="container px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-recoleta text-4xl md:text-5xl text-center mb-4">Our Gallery</motion.h1>
          <p className="text-center text-muted-foreground mb-8">Moments captured through our lens</p>
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              <button onClick={() => setActiveCategory(null)} className={`px-4 py-2 rounded-xl text-sm transition-all ${!activeCategory ? "bg-primary text-primary-foreground" : "glass-card text-foreground/70 hover:text-foreground"}`}>All</button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-4 py-2 rounded-xl text-sm transition-all ${activeCategory === cat.id ? "bg-primary text-primary-foreground" : "glass-card text-foreground/70 hover:text-foreground"}`}>{cat.name}</button>
              ))}
            </div>
          )}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            <AnimatePresence mode="popLayout">
              {images?.map((img, i) => (
                <motion.div key={img.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.03 }} className="mb-4 break-inside-avoid cursor-pointer group" onClick={() => setLightbox({ url: img.image_url, index: i })}>
                  <div className="rounded-xl overflow-hidden glass-card">
                    <img src={img.image_url} alt={img.title || "Gallery image"} className="w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {(!images || images.length === 0) && <p className="text-center text-muted-foreground py-20">No images yet. Upload through the admin panel.</p>}
        </section>
      </main>
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-background/95 flex items-center justify-center" onClick={() => setLightbox(null)}>
            <button className="absolute top-4 right-4 text-foreground/60 hover:text-foreground z-10" onClick={() => setLightbox(null)}><X size={24} /></button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground z-10" onClick={e => { e.stopPropagation(); navigateLightbox(-1); }}><ChevronLeft size={32} /></button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground z-10" onClick={e => { e.stopPropagation(); navigateLightbox(1); }}><ChevronRight size={32} /></button>
            <motion.img key={lightbox.url} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} src={lightbox.url} alt="Gallery preview" className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg" onClick={e => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </PageTransition>
  );
};

export default Gallery;
