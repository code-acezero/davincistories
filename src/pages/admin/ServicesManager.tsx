import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, X } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

const ServicesManager = () => {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", icon: "", image_url: "", display_order: 0, is_visible: true });

  const { data: items } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*").order("display_order");
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async (item: any) => {
      if (item.id) {
        const { error } = await supabase.from("services").update(item).eq("id", item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("services").insert(item);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-services"] }); setEditing(null); setAdding(false); toast({ title: "Saved!" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { await supabase.from("services").delete().eq("id", id); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-services"] }); toast({ title: "Deleted" }); },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-recoleta text-3xl">Services</h1>
        <button onClick={() => { setAdding(true); setForm({ title: "", description: "", icon: "", image_url: "", display_order: (items?.length ?? 0) + 1, is_visible: true }); }} className="bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm flex items-center gap-2 btn-glow"><Plus size={16} /> Add Service</button>
      </div>
      {(adding || editing) && (
        <div className="glass-card rounded-2xl p-6 mb-6 space-y-4">
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground" />
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" rows={3} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground resize-none" />
          <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="Icon name" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground" />
          <ImageUploader label="Image" value={form.image_url} onChange={url => setForm(f => ({ ...f, image_url: url }))} />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_visible} onChange={e => setForm(f => ({ ...f, is_visible: e.target.checked }))} /> Visible</label>
            <input type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} className="bg-muted/50 border border-border rounded-lg px-3 py-2 text-foreground w-24" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => save.mutate(editing ? { ...form, id: editing } : form)} className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm flex items-center gap-2"><Save size={14} /> Save</button>
            <button onClick={() => { setEditing(null); setAdding(false); }} className="bg-muted text-foreground rounded-lg px-4 py-2 text-sm flex items-center gap-2"><X size={14} /> Cancel</button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {items?.map(item => (
          <div key={item.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
            {item.image_url && <img src={item.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />}
            <div className="flex-1 min-w-0"><p className="font-medium truncate">{item.title}</p><p className="text-xs text-muted-foreground truncate">{item.description}</p></div>
            <span className={`text-xs px-2 py-1 rounded ${item.is_visible ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{item.is_visible ? "Visible" : "Hidden"}</span>
            <button onClick={() => { setEditing(item.id); setForm({ title: item.title, description: item.description ?? "", icon: item.icon ?? "", image_url: item.image_url ?? "", display_order: item.display_order, is_visible: item.is_visible }); }} className="text-muted-foreground hover:text-foreground"><Plus size={16} /></button>
            <button onClick={() => { if (confirm("Delete?")) del.mutate(item.id); }} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesManager;
