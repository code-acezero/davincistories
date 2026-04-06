import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/** Showcases highlights from Gallery, Blog, and Booking on the homepage */
const HomeSectionShowcase = () => {
  useScrollReveal();

  const { data: galleryImages } = useQuery({
    queryKey: ["showcase-gallery"],
    queryFn: async () => {
      const { data } = await supabase.from("gallery_images").select("*").eq("is_visible", true).order("display_order").limit(6);
      return data ?? [];
    },
  });

  const { data: blogPosts } = useQuery({
    queryKey: ["showcase-blog"],
    queryFn: async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("is_published", true).order("published_at", { ascending: false }).limit(3);
      return data ?? [];
    },
  });

  return (
    <>
      {/* Gallery Showcase */}
      {galleryImages && galleryImages.length > 0 && (
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="container px-4">
            <div className="text-center mb-12 reveal-up">
              <span className="text-primary text-sm uppercase tracking-[4px] font-medium mb-3 block">Gallery</span>
              <h2 className="font-recoleta text-3xl md:text-4xl">Visual <span className="text-gradient-primary">Stories</span></h2>
            </div>
            {/* Masonry-like grid */}
            <div className="columns-2 md:columns-3 gap-4 max-w-6xl mx-auto space-y-4">
              {galleryImages.map((img, i) => (
                <div key={img.id} className="reveal-up break-inside-avoid" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div className="glass-card rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-500 hover:-translate-y-1">
                    <div className="overflow-hidden relative">
                      <img
                        src={img.image_url}
                        alt={img.title || "Gallery"}
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                        {img.title && <p className="font-recoleta text-sm">{img.title}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10 reveal-up">
              <Link to="/gallery" className="inline-flex items-center gap-2 border border-primary/50 text-primary rounded-xl px-8 py-3 text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300 btn-glow group">
                Explore Gallery <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Blog Showcase */}
      {blogPosts && blogPosts.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="container px-4">
            <div className="text-center mb-12 reveal-up">
              <span className="text-primary text-sm uppercase tracking-[4px] font-medium mb-3 block">Stories</span>
              <h2 className="font-recoleta text-3xl md:text-4xl">Latest <span className="text-gradient-teal">Blog Posts</span></h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {blogPosts.map((post, i) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="reveal-up group" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="glass-card rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                    {post.cover_image && (
                      <div className="aspect-video overflow-hidden">
                        <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-recoleta text-lg mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                      <p className="text-sm text-muted-foreground flex-1 line-clamp-2">{post.excerpt}</p>
                      <span className="text-xs text-primary mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA / Booking Showcase */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-fantasy)" }} />
        <div className="container px-4 relative z-10 text-center reveal-up">
          <h2 className="font-recoleta text-3xl md:text-5xl mb-4">Ready to Create <span className="text-gradient-primary">Magic</span>?</h2>
          <p className="text-foreground/60 max-w-xl mx-auto mb-8">Let's bring your vision to life. Book a session with our team and turn your imagination into stunning visual stories.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/booking" className="bg-primary text-primary-foreground rounded-xl px-8 py-3 text-sm font-medium hover:opacity-90 transition-all btn-glow">
              Book a Session
            </Link>
            <Link to="/contact" className="border border-foreground/20 text-foreground rounded-xl px-8 py-3 text-sm hover:border-primary hover:text-primary transition-all">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeSectionShowcase;
