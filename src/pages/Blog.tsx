import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const Blog = () => {
  const { data: posts } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("is_published", true).order("published_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <section className="container px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-recoleta text-4xl md:text-5xl text-center mb-4">
            Blog & Stories
          </motion.h1>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Behind the lens — stories, tips, and creative insights
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {posts?.map((post, i) => (
              <motion.article key={post.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link to={`/blog/${post.slug}`} className="glass-card rounded-2xl overflow-hidden block group hover:border-primary/30 transition-all duration-500">
                  {post.cover_image && (
                    <div className="aspect-video overflow-hidden">
                      <img src={post.cover_image} alt={post.title} className="img-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                    </div>
                  )}
                  <div className="p-6">
                    {post.published_at && (
                      <time className="text-xs text-muted-foreground">{format(new Date(post.published_at), "MMM dd, yyyy")}</time>
                    )}
                    <h3 className="font-recoleta text-xl mt-2 mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
                  </div>
                </Link>
              </motion.article>
            ))}
            {(!posts || posts.length === 0) && (
              <p className="col-span-full text-center text-muted-foreground py-12">No blog posts yet. Check back soon!</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Blog;
