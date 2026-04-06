import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, X } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

const PortfolioManager = () => {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", image_url: "", video_url: "", category: "", display_order: 0, is_visible: true });

  const { data: items } = useQuery({ queryKey: ["admin-portfolio"], queryFn: async () => { const { data } = await supabase.from("portfolio_items").select("*").order("display_order"); return data ?? []; } });

  const save = useMutation({
    mutationFn: async (item: any) => {
      if (item.id) { const { error } = await supabase.from("portfolio_items").update(item).eq("id", item.id); if (error) throw error; }
      else { const { error } = await supabase.from("portfolio_items").insert(item); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-portfolio"] }); setEditing(null); setAdding(false); toast({ title: "Saved!" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({ mutationFn: async (id: string) => { await supabase.from("portfolio_items").delete().eq("id", id); }, onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-portfolio"] }); } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-recoleta text-3xl">Portfolio</h1>
        <button onClick={() => { setAdding(true); setForm({ title: "", description: "", image_url: "", video_url: "", category: "", display_order: (items?.length ?? 0) + 1, is_visible: true }); }} className="bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm flex items-center gap-2 btn-glow"><Plus size={16} /> Add</button>
      </div>
      {(adding || editing) && (
        <div className="glass-card rounded-2xl p-6 mb-6 space-y-4">
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground" />
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" rows={3} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground resize-none" />
          <ImageUploader label="Image" value={form.image_url} onChange={url => setForm(f => ({ ...f, image_url: url }))} />
          <input value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} placeholder="Video URL (optional)" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground" />
          <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Category" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground" />
          <div className="flex gap-3">
            <button onClick={() => save.mutate(editing ? { ...form, id: editing } : form)} className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm flex items-center gap-2"><Save size={14} /> Save</button>
            <button onClick={() => { setEditing(null); setAdding(false); }} className="bg-muted text-foreground rounded-lg px-4 py-2 text-sm"><X size={14} /></button>
          </div>
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items?.map(item => (
          <div key={item.id} className="glass-card rounded-xl overflow-hidden group relative">
            {item.image_url && <img src={item.image_url} alt={item.title} className="w-full aspect-video object-cover" loading="lazy" />}
            <div className="p-4"><p className="font-medium truncate">{item.title}</p><p className="text-xs text-muted-foreground">{item.category}</p></div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-2">
              <button onClick={() => { setEditing(item.id); setForm({ title: item.title, description: item.description ?? "", image_url: item.image_url ?? "", video_url: item.video_url ?? "", category: item.category ?? "", display_order: item.display_order, is_visible: item.is_visible }); }} className="bg-primary text-primary-foreground rounded-full p-1.5"><Plus size={12} /></button>
              <button onClick={() => { if (confirm("Delete?")) del.mutate(item.id); }} className="bg-destructive text-destructive-foreground rounded-full p-1.5"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioManager;
