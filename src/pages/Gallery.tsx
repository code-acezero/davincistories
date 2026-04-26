import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Search, Eye } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const OG_IMAGE = "https://davincistories.lovable.app/images/og-cover.jpg";

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ url: string; index: number } | null>(null);
  const [searchParams] = useSearchParams();
  const { isAdmin, isModerator } = useAuth();
  const previewMode = searchParams.get("preview") === "admin" && (isAdmin || isModerator);

  const { data: categories } = useQuery({
    queryKey: ["gallery-categories"],
    queryFn: async () => { const { data } = await supabase.from("gallery_categories").select("*").order("display_order"); return data ?? []; },
  });

  const { data: images } = useQuery({
    queryKey: ["gallery-images", activeCategory, previewMode],
    queryFn: async () => {
      let q = supabase.from("gallery_images").select("*").order("display_order");
      if (!previewMode) q = q.eq("status", "published");
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

  // Keyboard nav for lightbox
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!lightbox) return;
    if (e.key === "ArrowLeft") navigateLightbox(-1);
    if (e.key === "ArrowRight") navigateLightbox(1);
    if (e.key === "Escape") setLightbox(null);
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Gallery — DaVinci Stories</title>
        <meta name="description" content="Browse the DaVinci Stories gallery — a curated collection of our best photography and videography work across weddings, portraits, events, and more." />
        <link rel="canonical" href="https://davincistories.lovable.app/gallery" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Gallery — DaVinci Stories" />
        <meta property="og:description" content="A curated collection of our best photography and videography work." />
        <meta property="og:url" content="https://davincistories.lovable.app/gallery" />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gallery — DaVinci Stories" />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Helmet>
      <Header />
      <main className="pt-24 pb-20" onKeyDown={handleKeyDown} tabIndex={-1}>
        <section className="container px-4">
          {previewMode && (
            <div className="glass-card rounded-xl px-4 py-3 mb-6 max-w-3xl mx-auto border border-amber-500/40 bg-amber-500/10 flex items-center gap-3">
              <Eye size={16} className="text-amber-300" />
              <div className="text-xs text-amber-200"><strong>Preview mode</strong> — showing draft & review images. Public visitors won't see these.</div>
            </div>
          )}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-recoleta text-4xl md:text-6xl text-center mb-4">
            Our <span className="text-gradient-primary">Gallery</span>
          </motion.h1>
          <p className="text-center text-muted-foreground mb-10 max-w-lg mx-auto">Moments captured through our lens — each frame tells a story</p>

          {/* Category filter */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              <button onClick={() => setActiveCategory(null)} className={`px-5 py-2.5 rounded-full text-sm transition-all duration-300 ${!activeCategory ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(346_85%_55%/0.3)]" : "glass-card text-foreground/70 hover:text-foreground hover:border-primary/20"}`}>All</button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-5 py-2.5 rounded-full text-sm transition-all duration-300 ${activeCategory === cat.id ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(346_85%_55%/0.3)]" : "glass-card text-foreground/70 hover:text-foreground hover:border-primary/20"}`}>{cat.name}</button>
              ))}
            </div>
          )}

          {/* Masonry gallery with 3D tilt on hover */}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            <AnimatePresence mode="popLayout">
              {images?.map((img, i) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.03 }}
                  className="mb-4 break-inside-avoid cursor-pointer group perspective-[1000px]"
                  onClick={() => setLightbox({ url: img.image_url, index: i })}
                >
                  <div className="rounded-2xl overflow-hidden glass-card group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-500 group-hover:-translate-y-1">
                    <div className="overflow-hidden relative">
                      <img src={img.image_url} alt={img.title || "Gallery image"} className="w-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                        <div className="flex items-center gap-2">
                          <Search size={14} className="text-primary" />
                          {img.title && <p className="font-recoleta text-sm">{img.title}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {(!images || images.length === 0) && <p className="text-center text-muted-foreground py-20">No images yet. Upload through the admin panel.</p>}
        </section>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center" onClick={() => setLightbox(null)}>
            <button className="absolute top-4 right-4 text-foreground/60 hover:text-foreground z-10 w-10 h-10 rounded-full glass-card flex items-center justify-center" onClick={() => setLightbox(null)}><X size={20} /></button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass-card flex items-center justify-center hover:border-primary/30 transition-all" onClick={e => { e.stopPropagation(); navigateLightbox(-1); }}><ChevronLeft size={24} /></button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass-card flex items-center justify-center hover:border-primary/30 transition-all" onClick={e => { e.stopPropagation(); navigateLightbox(1); }}><ChevronRight size={24} /></button>
            <motion.img key={lightbox.url} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} src={lightbox.url} alt="Gallery preview" className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl" onClick={e => e.stopPropagation()} />
            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-card rounded-full px-4 py-1.5 text-xs text-muted-foreground">
              {lightbox.index + 1} / {images?.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </PageTransition>
  );
};

export default Gallery;
