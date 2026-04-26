import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, X, Edit, Link2, Send, CheckCircle2, RotateCcw } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import StatusBadge from "@/components/admin/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";

type Status = "draft" | "review" | "published";

const BlogManager = () => {
  const qc = useQueryClient();
  const { user, isAdmin } = useAuth();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", content: "", excerpt: "", cover_image: "", status: "draft" as Status });

  const { data: posts } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async (item: any) => {
      const payload: any = {
        title: item.title, slug: item.slug, content: item.content,
        excerpt: item.excerpt, cover_image: item.cover_image,
        status: item.status, author_id: user?.id,
      };
      if (item.status === "review" && !item.id) {
        payload.submitted_at = new Date().toISOString();
        payload.submitted_by = user?.id;
      }
      if (item.id) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blog"] }); setEditing(null); setAdding(false); toast({ title: "Saved!" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const transition = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const patch: any = { status };
      if (status === "review") { patch.submitted_at = new Date().toISOString(); patch.submitted_by = user?.id; }
      const { error } = await supabase.from("blog_posts").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blog"] }); toast({ title: "Status updated" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("blog_posts").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blog"] }); toast({ title: "Deleted" }); },
  });

  const generateSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const copyPreview = (post: any) => {
    const url = `${window.location.origin}/blog/${post.slug}?preview=${post.preview_token}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Preview link copied", description: url });
  };

  const allowedStatusesForForm: Status[] = isAdmin ? ["draft", "review", "published"] : ["draft", "review"];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-recoleta text-3xl">Blog Posts</h1>
          <p className="text-xs text-muted-foreground mt-1">{isAdmin ? "Admin — full publishing control" : "Moderator — submit drafts for review"}</p>
        </div>
        <button onClick={() => { setAdding(true); setEditing(null); setForm({ title: "", slug: "", content: "", excerpt: "", cover_image: "", status: "draft" }); }} className="bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm flex items-center gap-2 btn-glow"><Plus size={16} /> New Post</button>
      </div>

      {(adding || editing) && (
        <div className="glass-card rounded-2xl p-6 mb-6 space-y-4">
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: f.slug || generateSlug(e.target.value) }))} placeholder="Title" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground text-lg" />
          <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="slug-url" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground text-sm" />
          <ImageUploader label="Cover Image" value={form.cover_image} onChange={url => setForm(f => ({ ...f, cover_image: url }))} />
          <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Excerpt / Summary" rows={2} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground resize-none" />
          <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Content..." rows={12} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground resize-y font-mono text-sm" />

          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground">Status:</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Status }))} className="bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-sm">
              {allowedStatusesForForm.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {!isAdmin && <span className="text-[11px] text-muted-foreground">Only admins can publish.</span>}
          </div>

          <div className="flex gap-3">
            <button onClick={() => save.mutate(editing ? { ...form, id: editing } : form)} className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm flex items-center gap-2"><Save size={14} /> Save</button>
            <button onClick={() => { setEditing(null); setAdding(false); }} className="bg-muted text-foreground rounded-lg px-4 py-2 text-sm flex items-center gap-2"><X size={14} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {posts?.map(post => (
          <div key={post.id} className="glass-card rounded-xl p-4 flex items-center gap-4 flex-wrap">
            {post.cover_image && <img src={post.cover_image} alt="" className="w-16 h-10 rounded-lg object-cover" />}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{post.title}</p>
              <p className="text-xs text-muted-foreground">/{post.slug}</p>
            </div>
            <StatusBadge status={post.status as Status} />

            {/* Workflow buttons */}
            {post.status === "draft" && (
              <button onClick={() => transition.mutate({ id: post.id, status: "review" })} title="Submit for review" className="text-amber-400 hover:text-amber-300 p-1.5 rounded-lg hover:bg-amber-500/10"><Send size={15} /></button>
            )}
            {post.status === "review" && isAdmin && (
              <button onClick={() => transition.mutate({ id: post.id, status: "published" })} title="Approve & publish" className="text-emerald-400 hover:text-emerald-300 p-1.5 rounded-lg hover:bg-emerald-500/10"><CheckCircle2 size={15} /></button>
            )}
            {post.status === "review" && (
              <button onClick={() => transition.mutate({ id: post.id, status: "draft" })} title="Send back to draft" className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted/30"><RotateCcw size={15} /></button>
            )}
            {post.status === "published" && isAdmin && (
              <button onClick={() => transition.mutate({ id: post.id, status: "draft" })} title="Unpublish" className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted/30"><RotateCcw size={15} /></button>
            )}

            <button onClick={() => copyPreview(post)} title="Copy preview link" className="text-muted-foreground hover:text-primary p-1.5 rounded-lg hover:bg-primary/10"><Link2 size={15} /></button>
            <button onClick={() => { setEditing(post.id); setAdding(false); setForm({ title: post.title, slug: post.slug, content: post.content ?? "", excerpt: post.excerpt ?? "", cover_image: post.cover_image ?? "", status: (post.status as Status) ?? "draft" }); }} className="text-muted-foreground hover:text-foreground p-1.5"><Edit size={15} /></button>
            {isAdmin && <button onClick={() => { if (confirm("Delete?")) del.mutate(post.id); }} className="text-muted-foreground hover:text-destructive p-1.5"><Trash2 size={15} /></button>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogManager;
