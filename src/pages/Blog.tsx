import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { ArrowRight, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const OG_IMAGE = "https://davincistories.lovable.app/images/og-cover.jpg";

const Blog = () => {
  const [searchParams] = useSearchParams();
  const { isAdmin, isModerator } = useAuth();
  const previewMode = searchParams.get("preview") === "admin" && (isAdmin || isModerator);

  const { data: posts } = useQuery({
    queryKey: ["blog-posts", previewMode],
    queryFn: async () => {
      let q = supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (!previewMode) q = q.eq("status", "published").order("published_at", { ascending: false });
      const { data } = await q;
      return data ?? [];
    },
  });

  return (
    <PageTransition>
      <Helmet>
        <title>Blog & Stories — DaVinci Stories</title>
        <meta name="description" content="Read behind-the-lens stories, photography tips, and creative insights from the DaVinci Stories team." />
        <link rel="canonical" href="https://davincistories.lovable.app/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Blog & Stories — DaVinci Stories" />
        <meta property="og:description" content="Behind-the-lens stories, photography tips, and creative insights." />
        <meta property="og:url" content="https://davincistories.lovable.app/blog" />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog & Stories — DaVinci Stories" />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Helmet>
      <Header />
      <main className="pt-24 pb-20">
        <section className="container px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-recoleta text-4xl md:text-6xl text-center mb-4">
            Blog & <span className="text-gradient-teal">Stories</span>
          </motion.h1>
          <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
            Behind the lens — stories, tips, and creative insights
          </p>

          {posts && posts.length > 0 ? (
            <div className="max-w-6xl mx-auto">
              {/* Featured post */}
              <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                <Link to={`/blog/${posts[0].slug}`} className="glass-card rounded-3xl overflow-hidden block group hover:border-primary/30 transition-all duration-500 md:flex">
                  {posts[0].cover_image && (
                    <div className="md:w-1/2 aspect-video md:aspect-auto overflow-hidden">
                      <img src={posts[0].cover_image} alt={posts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                    <span className="text-primary text-xs uppercase tracking-wider mb-3">Featured</span>
                    {posts[0].published_at && <time className="text-xs text-muted-foreground mb-2">{format(new Date(posts[0].published_at), "MMM dd, yyyy")}</time>}
                    <h2 className="font-recoleta text-2xl md:text-3xl mb-4 group-hover:text-primary transition-colors">{posts[0].title}</h2>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{posts[0].excerpt}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-primary group-hover:gap-2 transition-all">
                      Read More <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.article>

              {/* Rest of posts */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.slice(1).map((post, i) => (
                  <motion.article key={post.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Link to={`/blog/${post.slug}`} className="glass-card rounded-2xl overflow-hidden block group hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 h-full flex flex-col">
                      {post.cover_image && (
                        <div className="aspect-video overflow-hidden">
                          <img src={post.cover_image} alt={post.title} className="img-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                        </div>
                      )}
                      <div className="p-6 flex-1 flex flex-col">
                        {post.published_at && <time className="text-xs text-muted-foreground">{format(new Date(post.published_at), "MMM dd, yyyy")}</time>}
                        <h3 className="font-recoleta text-xl mt-2 mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-3 flex-1">{post.excerpt}</p>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-20">No blog posts yet. Check back soon!</p>
          )}
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default Blog;
