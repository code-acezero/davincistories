import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, Save, X, Send, CheckCircle2, RotateCcw, Link2 } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import StatusBadge from "@/components/admin/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";

type Status = "draft" | "review" | "published";

const GalleryManager = () => {
  const qc = useQueryClient();
  const { user, isAdmin } = useAuth();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ image_url: "", title: "", description: "", category_id: null as string | null, display_order: 0, status: "draft" as Status });

  const { data: images } = useQuery({ queryKey: ["admin-gallery"], queryFn: async () => { const { data } = await supabase.from("gallery_images").select("*, gallery_categories(name)").order("display_order"); return data ?? []; } });
  const { data: categories } = useQuery({ queryKey: ["admin-gallery-cats"], queryFn: async () => { const { data } = await supabase.from("gallery_categories").select("*").order("display_order"); return data ?? []; } });

  const save = useMutation({
    mutationFn: async (item: any) => {
      const payload: any = { image_url: item.image_url, title: item.title, description: item.description, category_id: item.category_id || null, display_order: item.display_order, status: item.status };
      if (item.id) { const { error } = await supabase.from("gallery_images").update(payload).eq("id", item.id); if (error) throw error; }
      else {
        if (item.status === "review") { payload.submitted_at = new Date().toISOString(); payload.submitted_by = user?.id; }
        const { error } = await supabase.from("gallery_images").insert(payload); if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-gallery"] }); setEditing(null); setAdding(false); toast({ title: "Saved!" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const transition = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const patch: any = { status };
      if (status === "review") { patch.submitted_at = new Date().toISOString(); patch.submitted_by = user?.id; }
      const { error } = await supabase.from("gallery_images").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-gallery"] }); toast({ title: "Status updated" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({ mutationFn: async (id: string) => { await supabase.from("gallery_images").delete().eq("id", id); }, onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-gallery"] }); toast({ title: "Deleted" }); } });

  const allowedStatuses: Status[] = isAdmin ? ["draft", "review", "published"] : ["draft", "review"];

  const copyPreview = () => {
    const url = `${window.location.origin}/gallery?preview=admin`;
    navigator.clipboard.writeText(url);
    toast({ title: "Preview link copied", description: "Sign in as admin/moderator to see drafts." });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="font-recoleta text-3xl">Gallery</h1>
          <p className="text-xs text-muted-foreground mt-1">{isAdmin ? "Admin — full publishing control" : "Moderator — submit for review"}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={copyPreview} className="glass-card text-foreground rounded-xl px-4 py-2 text-sm flex items-center gap-2 border border-border hover:border-primary/30"><Link2 size={14} /> Preview</button>
          <button onClick={() => { setAdding(true); setEditing(null); setForm({ image_url: "", title: "", description: "", category_id: null, display_order: (images?.length ?? 0) + 1, status: "draft" }); }} className="bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm flex items-center gap-2 btn-glow"><Plus size={16} /> Add Image</button>
        </div>
      </div>

      {(adding || editing) && (
        <div className="glass-card rounded-2xl p-6 mb-6 space-y-4">
          <ImageUploader label="Image" value={form.image_url} onChange={url => setForm(f => ({ ...f, image_url: url }))} />
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground" />
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" rows={2} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground resize-none" />
          <select value={form.category_id ?? ""} onChange={e => setForm(f => ({ ...f, category_id: e.target.value || null }))} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground">
            <option value="">No Category</option>
            {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground">Status:</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Status }))} className="bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-sm">
              {allowedStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={() => save.mutate(editing ? { ...form, id: editing } : form)} className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm flex items-center gap-2"><Save size={14} /> Save</button>
            <button onClick={() => { setEditing(null); setAdding(false); }} className="bg-muted text-foreground rounded-lg px-4 py-2 text-sm flex items-center gap-2"><X size={14} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {images?.map((img: any) => (
          <div key={img.id} className="glass-card rounded-xl overflow-hidden group relative">
            <img src={img.image_url} alt={img.title} className="w-full aspect-square object-cover" loading="lazy" />
            <div className="absolute top-2 left-2"><StatusBadge status={(img.status ?? "draft") as Status} /></div>
            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 flex-wrap p-2">
              {img.status === "draft" && <button onClick={() => transition.mutate({ id: img.id, status: "review" })} title="Submit for review" className="bg-amber-500/80 text-white rounded-full p-2"><Send size={13} /></button>}
              {img.status === "review" && isAdmin && <button onClick={() => transition.mutate({ id: img.id, status: "published" })} title="Publish" className="bg-emerald-500/80 text-white rounded-full p-2"><CheckCircle2 size={13} /></button>}
              {img.status !== "draft" && <button onClick={() => transition.mutate({ id: img.id, status: "draft" })} title="Back to draft" className="bg-muted/80 text-foreground rounded-full p-2"><RotateCcw size={13} /></button>}
              <button onClick={() => { setAdding(false); setEditing(img.id); setForm({ image_url: img.image_url, title: img.title ?? "", description: img.description ?? "", category_id: img.category_id, display_order: img.display_order, status: (img.status ?? "draft") as Status }); }} className="bg-primary text-primary-foreground rounded-full p-2"><Edit size={13} /></button>
              {isAdmin && <button onClick={() => { if (confirm("Delete?")) del.mutate(img.id); }} className="bg-destructive text-destructive-foreground rounded-full p-2"><Trash2 size={13} /></button>}
            </div>
            <div className="p-3"><p className="text-sm truncate">{img.title || "Untitled"}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryManager;
