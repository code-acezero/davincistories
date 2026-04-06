import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, X, Eye, EyeOff } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { useAuth } from "@/contexts/AuthContext";

const BlogManager = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", content: "", excerpt: "", cover_image: "", is_published: false });

  const { data: posts } = useQuery({ queryKey: ["admin-blog"], queryFn: async () => { const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false }); return data ?? []; } });

  const save = useMutation({
    mutationFn: async (item: any) => {
      const payload = { ...item, author_id: user?.id, published_at: item.is_published ? new Date().toISOString() : null };
      if (item.id) { const { error } = await supabase.from("blog_posts").update(payload).eq("id", item.id); if (error) throw error; }
      else { const { error } = await supabase.from("blog_posts").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blog"] }); setEditing(null); setAdding(false); toast({ title: "Saved!" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({ mutationFn: async (id: string) => { await supabase.from("blog_posts").delete().eq("id", id); }, onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blog"] }); } });

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-recoleta text-3xl">Blog Posts</h1>
        <button onClick={() => { setAdding(true); setForm({ title: "", slug: "", content: "", excerpt: "", cover_image: "", is_published: false }); }} className="bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm flex items-center gap-2 btn-glow"><Plus size={16} /> New Post</button>
      </div>
      {(adding || editing) && (
        <div className="glass-card rounded-2xl p-6 mb-6 space-y-4">
          <input value={form.title} onChange={e => { setForm(f => ({ ...f, title: e.target.value, slug: f.slug || generateSlug(e.target.value) })); }} placeholder="Title" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground text-lg" />
          <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="slug-url" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground text-sm" />
          <ImageUploader label="Cover Image" value={form.cover_image} onChange={url => setForm(f => ({ ...f, cover_image: url }))} />
          <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Excerpt / Summary" rows={2} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground resize-none" />
          <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Content..." rows={12} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground resize-y font-mono text-sm" />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_published} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} /> Published</label>
          <div className="flex gap-3">
            <button onClick={() => save.mutate(editing ? { ...form, id: editing } : form)} className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm flex items-center gap-2"><Save size={14} /> Save</button>
            <button onClick={() => { setEditing(null); setAdding(false); }} className="bg-muted text-foreground rounded-lg px-4 py-2 text-sm"><X size={14} /></button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {posts?.map(post => (
          <div key={post.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
            {post.cover_image && <img src={post.cover_image} alt="" className="w-16 h-10 rounded-lg object-cover" />}
            <div className="flex-1 min-w-0"><p className="font-medium truncate">{post.title}</p><p className="text-xs text-muted-foreground">/{post.slug}</p></div>
            {post.is_published ? <Eye size={16} className="text-green-400" /> : <EyeOff size={16} className="text-muted-foreground" />}
            <button onClick={() => { setEditing(post.id); setForm({ title: post.title, slug: post.slug, content: post.content ?? "", excerpt: post.excerpt ?? "", cover_image: post.cover_image ?? "", is_published: post.is_published }); }} className="text-muted-foreground hover:text-foreground"><Plus size={16} /></button>
            <button onClick={() => { if (confirm("Delete?")) del.mutate(post.id); }} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogManager;
