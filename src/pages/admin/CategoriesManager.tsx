import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, X } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

const CategoriesManager = () => {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", image_url: "", display_order: 0, is_visible: true });

  const { data: items } = useQuery({ queryKey: ["admin-categories"], queryFn: async () => { const { data } = await supabase.from("category_items").select("*").order("display_order"); return data ?? []; } });

  const save = useMutation({
    mutationFn: async (item: any) => {
      if (item.id) { const { error } = await supabase.from("category_items").update(item).eq("id", item.id); if (error) throw error; }
      else { const { error } = await supabase.from("category_items").insert(item); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-categories"] }); setEditing(null); setAdding(false); toast({ title: "Saved!" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({ mutationFn: async (id: string) => { await supabase.from("category_items").delete().eq("id", id); }, onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-categories"] }) });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-recoleta text-3xl">Category Items</h1>
        <button onClick={() => { setAdding(true); setForm({ title: "", image_url: "", display_order: (items?.length ?? 0) + 1, is_visible: true }); }} className="bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm flex items-center gap-2 btn-glow"><Plus size={16} /> Add</button>
      </div>
      {(adding || editing) && (
        <div className="glass-card rounded-2xl p-6 mb-6 space-y-4">
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground" />
          <ImageUploader label="Image" value={form.image_url} onChange={url => setForm(f => ({ ...f, image_url: url }))} />
          <div className="flex gap-3">
            <button onClick={() => save.mutate(editing ? { ...form, id: editing } : form)} className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm flex items-center gap-2"><Save size={14} /> Save</button>
            <button onClick={() => { setEditing(null); setAdding(false); }} className="bg-muted text-foreground rounded-lg px-4 py-2 text-sm"><X size={14} /></button>
          </div>
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items?.map(item => (
          <div key={item.id} className="glass-card rounded-xl overflow-hidden group relative">
            {item.image_url && <img src={item.image_url} alt={item.title} className="w-full aspect-square object-cover" loading="lazy" />}
            <div className="p-3"><p className="text-sm font-medium truncate">{item.title}</p></div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-2">
              <button onClick={() => { setEditing(item.id); setForm({ title: item.title, image_url: item.image_url ?? "", display_order: item.display_order, is_visible: item.is_visible }); }} className="bg-primary text-primary-foreground rounded-full p-1.5"><Plus size={12} /></button>
              <button onClick={() => { if (confirm("Delete?")) del.mutate(item.id); }} className="bg-destructive text-destructive-foreground rounded-full p-1.5"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesManager;
