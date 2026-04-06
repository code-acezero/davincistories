import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("is_published", true).single();
      return data;
    },
    enabled: !!slug,
  });

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <article className="container max-w-3xl mx-auto px-4">
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-64 bg-muted rounded" />
            </div>
          ) : post ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {post.cover_image && (
                <img src={post.cover_image} alt={post.title} className="w-full rounded-2xl mb-8 max-h-[500px] object-cover" />
              )}
              <h1 className="font-recoleta text-3xl md:text-5xl mb-4">{post.title}</h1>
              {post.published_at && (
                <time className="text-muted-foreground text-sm">{format(new Date(post.published_at), "MMMM dd, yyyy")}</time>
              )}
              <div className="mt-8 prose prose-invert max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </motion.div>
          ) : (
            <p className="text-center text-muted-foreground py-20">Post not found.</p>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
};

export default BlogPost;
