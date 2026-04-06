import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

const GalleryManager = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ image_url: "", title: "", description: "", category_id: "" as string | null, display_order: 0, is_visible: true });

  const { data: images } = useQuery({ queryKey: ["admin-gallery"], queryFn: async () => { const { data } = await supabase.from("gallery_images").select("*, gallery_categories(name)").order("display_order"); return data ?? []; } });
  const { data: categories } = useQuery({ queryKey: ["admin-gallery-cats"], queryFn: async () => { const { data } = await supabase.from("gallery_categories").select("*").order("display_order"); return data ?? []; } });

  const save = useMutation({
    mutationFn: async (item: any) => {
      const payload = { ...item, category_id: item.category_id || null };
      delete payload.gallery_categories;
      if (item.id) { const { error } = await supabase.from("gallery_images").update(payload).eq("id", item.id); if (error) throw error; }
      else { const { error } = await supabase.from("gallery_images").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-gallery"] }); setEditing(null); setAdding(false); toast({ title: "Saved!" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({ mutationFn: async (id: string) => { await supabase.from("gallery_images").delete().eq("id", id); }, onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-gallery"] }); toast({ title: "Deleted" }); } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-recoleta text-3xl">Gallery</h1>
        <button onClick={() => { setAdding(true); setForm({ image_url: "", title: "", description: "", category_id: null, display_order: (images?.length ?? 0) + 1, is_visible: true }); }} className="bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm flex items-center gap-2 btn-glow"><Plus size={16} /> Add Image</button>
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
          <div className="flex gap-3">
            <button onClick={() => save.mutate(editing ? { ...form, id: editing } : form)} className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm flex items-center gap-2"><Save size={14} /> Save</button>
            <button onClick={() => { setEditing(null); setAdding(false); }} className="bg-muted text-foreground rounded-lg px-4 py-2 text-sm flex items-center gap-2"><X size={14} /> Cancel</button>
          </div>
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {images?.map(img => (
          <div key={img.id} className="glass-card rounded-xl overflow-hidden group relative">
            <img src={img.image_url} alt={img.title} className="w-full aspect-square object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button onClick={() => { setEditing(img.id); setForm({ image_url: img.image_url, title: img.title ?? "", description: img.description ?? "", category_id: img.category_id, display_order: img.display_order, is_visible: img.is_visible }); }} className="bg-primary text-primary-foreground rounded-full p-2"><Edit size={14} /></button>
              <button onClick={() => { if (confirm("Delete?")) del.mutate(img.id); }} className="bg-destructive text-destructive-foreground rounded-full p-2"><Trash2 size={14} /></button>
            </div>
            <div className="p-3"><p className="text-sm truncate">{img.title || "Untitled"}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryManager;
