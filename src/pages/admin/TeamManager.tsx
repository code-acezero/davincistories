import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, Save, X, GripVertical } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

const TeamManager = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "", bio: "", photo_url: "", photo_alt_url: "", display_order: 0, is_visible: true });
  const [adding, setAdding] = useState(false);

  const { data: members } = useQuery({
    queryKey: ["admin-team"],
    queryFn: async () => {
      const { data } = await supabase.from("team_members").select("*").order("display_order");
      return data ?? [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (member: typeof form & { id?: string }) => {
      if (member.id) {
        const { error } = await supabase.from("team_members").update(member).eq("id", member.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("team_members").insert(member);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-team"] }); setEditing(null); setAdding(false); toast({ title: "Saved!" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-team"] }); toast({ title: "Deleted" }); },
  });

  const startEdit = (m: any) => { setEditing(m.id); setForm({ name: m.name, role: m.role, bio: m.bio, photo_url: m.photo_url, photo_alt_url: m.photo_alt_url, display_order: m.display_order, is_visible: m.is_visible }); };
  const startAdd = () => { setAdding(true); setForm({ name: "", role: "", bio: "", photo_url: "", photo_alt_url: "", display_order: (members?.length ?? 0) + 1, is_visible: true }); };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-recoleta text-3xl">Team Members</h1>
        <button onClick={startAdd} className="bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm flex items-center gap-2 btn-glow"><Plus size={16} /> Add Member</button>
      </div>

      {(adding || editing) && (
        <div className="glass-card rounded-2xl p-6 mb-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" className="bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground" />
            <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Role / Title" className="bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground" />
          </div>
          <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Bio" rows={3} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground resize-none" />
          <div className="grid sm:grid-cols-2 gap-4">
            <ImageUploader label="Photo" value={form.photo_url} onChange={url => setForm(f => ({ ...f, photo_url: url }))} />
            <ImageUploader label="Alt Photo" value={form.photo_alt_url} onChange={url => setForm(f => ({ ...f, photo_alt_url: url }))} />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_visible} onChange={e => setForm(f => ({ ...f, is_visible: e.target.checked }))} /> Visible
            </label>
            <input type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} className="bg-muted/50 border border-border rounded-lg px-3 py-2 text-foreground w-24" placeholder="Order" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => saveMutation.mutate(editing ? { ...form, id: editing } : form)} className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm flex items-center gap-2"><Save size={14} /> Save</button>
            <button onClick={() => { setEditing(null); setAdding(false); }} className="bg-muted text-foreground rounded-lg px-4 py-2 text-sm flex items-center gap-2"><X size={14} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {members?.map(m => (
          <div key={m.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
            <GripVertical className="text-muted-foreground cursor-grab" size={16} />
            {m.photo_url && <img src={m.photo_url} alt={m.name} className="w-12 h-12 rounded-full object-cover" />}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{m.name}</p>
              <p className="text-sm text-muted-foreground truncate">{m.role}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${m.is_visible ? "bg-green-500/10 text-green-400" : "bg-muted text-muted-foreground"}`}>{m.is_visible ? "Visible" : "Hidden"}</span>
            <button onClick={() => startEdit(m)} className="text-muted-foreground hover:text-foreground"><Edit size={16} /></button>
            <button onClick={() => { if (confirm("Delete this member?")) deleteMutation.mutate(m.id); }} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
          </div>
        ))}
        {(!members || members.length === 0) && <p className="text-center text-muted-foreground py-8">No team members yet.</p>}
      </div>
    </div>
  );
};

export default TeamManager;
