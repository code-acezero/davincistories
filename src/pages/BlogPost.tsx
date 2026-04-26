import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft, Clock, Share2, Eye } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const previewToken = searchParams.get("preview");

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug, previewToken],
    queryFn: async () => {
      let q = supabase.from("blog_posts").select("*").eq("slug", slug);
      if (previewToken) q = q.eq("preview_token", previewToken);
      else q = q.eq("status", "published");
      const { data } = await q.maybeSingle();
      return data;
    },
    enabled: !!slug,
  });

  const ogImage = post?.cover_image || "https://davincistories.lovable.app/images/og-cover.jpg";

  return (
    <PageTransition>
      <Helmet>
        <title>{post?.title ? `${post.title} — DaVinci Stories` : "Blog — DaVinci Stories"}</title>
        <meta name="description" content={post?.excerpt || "Read this story from DaVinci Stories."} />
        {post?.slug && <link rel="canonical" href={`https://davincistories.lovable.app/blog/${post.slug}`} />}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post?.title || "Blog — DaVinci Stories"} />
        <meta property="og:description" content={post?.excerpt || "Read this story from DaVinci Stories."} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={`https://davincistories.lovable.app/blog/${slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post?.title || "Blog — DaVinci Stories"} />
        <meta name="twitter:description" content={post?.excerpt || ""} />
        <meta name="twitter:image" content={ogImage} />
        {post && (
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "image": post.cover_image,
            "datePublished": post.published_at,
            "dateModified": post.updated_at,
            "author": { "@type": "Organization", "name": "DaVinci Stories" },
            "publisher": { "@type": "Organization", "name": "DaVinci Stories" },
            "description": post.excerpt,
          })}</script>
        )}
      </Helmet>
      <Header />
      <main className="pt-24 pb-20">
        <article className="container max-w-3xl mx-auto px-4">
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm">
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
                <div className="rounded-3xl overflow-hidden mb-8 glass-card">
                  <img src={post.cover_image} alt={post.title} className="w-full max-h-[500px] object-cover" />
                </div>
              )}
              <h1 className="font-recoleta text-3xl md:text-5xl mb-4">{post.title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground text-sm mb-8 pb-8 border-b border-border">
                {post.published_at && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} /> {format(new Date(post.published_at), "MMMM dd, yyyy")}
                  </span>
                )}
                <button
                  onClick={() => navigator.share?.({ title: post.title, url: window.location.href })}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors ml-auto"
                >
                  <Share2 size={14} /> Share
                </button>
              </div>
              <div className="prose prose-invert max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap text-[17px]">
                {post.content}
              </div>
            </motion.div>
          ) : (
            <p className="text-center text-muted-foreground py-20">Post not found.</p>
          )}
        </article>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default BlogPost;
