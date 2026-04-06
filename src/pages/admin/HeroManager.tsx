import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, X } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

const HeroManager = () => {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", subtitle: "", image_url: "", video_url: "", display_order: 0, is_visible: true });

  const { data: slides } = useQuery({ queryKey: ["admin-hero"], queryFn: async () => { const { data } = await supabase.from("hero_slides").select("*").order("display_order"); return data ?? []; } });

  const save = useMutation({
    mutationFn: async (item: any) => {
      if (item.id) { const { error } = await supabase.from("hero_slides").update(item).eq("id", item.id); if (error) throw error; }
      else { const { error } = await supabase.from("hero_slides").insert(item); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-hero"] }); setEditing(null); setAdding(false); toast({ title: "Saved!" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({ mutationFn: async (id: string) => { await supabase.from("hero_slides").delete().eq("id", id); }, onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-hero"] }) });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-recoleta text-3xl">Hero Slides</h1>
        <button onClick={() => { setAdding(true); setForm({ title: "", subtitle: "", image_url: "", video_url: "", display_order: (slides?.length ?? 0) + 1, is_visible: true }); }} className="bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm flex items-center gap-2 btn-glow"><Plus size={16} /> Add Slide</button>
      </div>
      {(adding || editing) && (
        <div className="glass-card rounded-2xl p-6 mb-6 space-y-4">
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground" />
          <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Subtitle" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground" />
          <ImageUploader label="Image" value={form.image_url} onChange={url => setForm(f => ({ ...f, image_url: url }))} />
          <input value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} placeholder="Video URL" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground" />
          <div className="flex gap-3">
            <button onClick={() => save.mutate(editing ? { ...form, id: editing } : form)} className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm flex items-center gap-2"><Save size={14} /> Save</button>
            <button onClick={() => { setEditing(null); setAdding(false); }} className="bg-muted text-foreground rounded-lg px-4 py-2 text-sm"><X size={14} /></button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {slides?.map(s => (
          <div key={s.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
            {s.image_url && <img src={s.image_url} alt="" className="w-20 h-12 rounded-lg object-cover" />}
            <div className="flex-1"><p className="font-medium">{s.title || "Untitled"}</p><p className="text-sm text-muted-foreground">{s.subtitle}</p></div>
            <button onClick={() => { setEditing(s.id); setForm({ title: s.title, subtitle: s.subtitle ?? "", image_url: s.image_url ?? "", video_url: s.video_url ?? "", display_order: s.display_order, is_visible: s.is_visible }); }} className="text-muted-foreground hover:text-foreground"><Plus size={16} /></button>
            <button onClick={() => { if (confirm("Delete?")) del.mutate(s.id); }} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroManager;
