import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, X } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

const AdminCRUD = ({ tableName, title, fields }: { tableName: string; title: string; fields: { key: string; label: string; type: string }[] }) => {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});

  const { data: items } = useQuery({
    queryKey: [`admin-${tableName}`],
    queryFn: async () => { const { data } = await supabase.from(tableName as any).select("*").order("display_order" as any); return (data ?? []) as any[]; },
  });

  const save = useMutation({
    mutationFn: async (item: any) => {
      if (item.id) { const { error } = await supabase.from(tableName as any).update(item).eq("id" as any, item.id); if (error) throw error; }
      else { const { error } = await supabase.from(tableName as any).insert(item as any); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: [`admin-${tableName}`] }); setEditing(null); setAdding(false); toast({ title: "Saved!" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { await supabase.from(tableName as any).delete().eq("id" as any, id); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: [`admin-${tableName}`] }); toast({ title: "Deleted" }); },
  });

  const initForm = () => {
    const f: Record<string, any> = {};
    fields.forEach(field => { f[field.key] = field.type === "boolean" ? true : field.type === "number" ? 0 : ""; });
    return f;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-recoleta text-3xl">{title}</h1>
        <button onClick={() => { setAdding(true); setForm(initForm()); }} className="bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm flex items-center gap-2 btn-glow"><Plus size={16} /> Add</button>
      </div>
      {(adding || editing) && (
        <div className="glass-card rounded-2xl p-6 mb-6 space-y-4">
          {fields.map(field => (
            <div key={field.key}>
              {field.type === "image" ? (
                <ImageUploader label={field.label} value={form[field.key] ?? ""} onChange={url => setForm(f => ({ ...f, [field.key]: url }))} />
              ) : field.type === "textarea" ? (
                <><label className="text-sm text-foreground/70 mb-1 block">{field.label}</label><textarea value={form[field.key] ?? ""} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} rows={3} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground resize-none" /></>
              ) : field.type === "boolean" ? (
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form[field.key] ?? true} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.checked }))} /> {field.label}</label>
              ) : field.type === "number" ? (
                <><label className="text-sm text-foreground/70 mb-1 block">{field.label}</label><input type="number" value={form[field.key] ?? 0} onChange={e => setForm(f => ({ ...f, [field.key]: parseInt(e.target.value) || 0 }))} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground" /></>
              ) : (
                <><label className="text-sm text-foreground/70 mb-1 block">{field.label}</label><input value={form[field.key] ?? ""} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground" /></>
              )}
            </div>
          ))}
          <div className="flex gap-3">
            <button onClick={() => save.mutate(editing ? { ...form, id: editing } : form)} className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm flex items-center gap-2"><Save size={14} /> Save</button>
            <button onClick={() => { setEditing(null); setAdding(false); }} className="bg-muted text-foreground rounded-lg px-4 py-2 text-sm flex items-center gap-2"><X size={14} /> Cancel</button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {items?.map((item: any) => (
          <div key={item.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
            {item.image_url && <img src={item.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />}
            <div className="flex-1 min-w-0"><p className="font-medium truncate">{item.title || item.name || item.key || "Untitled"}</p></div>
            <button onClick={() => { setEditing(item.id); const f: Record<string, any> = {}; fields.forEach(field => { f[field.key] = item[field.key]; }); setForm(f); }} className="text-muted-foreground hover:text-foreground"><Plus size={16} /></button>
            <button onClick={() => { if (confirm("Delete?")) del.mutate(item.id); }} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Services Manager
const ServicesManager = () => (
  <AdminCRUD tableName="services" title="Services" fields={[
    { key: "title", label: "Title", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "icon", label: "Icon Name", type: "text" },
    { key: "image_url", label: "Image", type: "image" },
    { key: "display_order", label: "Display Order", type: "number" },
    { key: "is_visible", label: "Visible", type: "boolean" },
  ]} />
);

export default ServicesManager;
