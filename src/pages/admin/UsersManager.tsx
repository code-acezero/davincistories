import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Trash2, Shield, ShieldCheck } from "lucide-react";

const UsersManager = () => {
  const qc = useQueryClient();
  const { data: profiles } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profs } = await supabase.from("profiles").select("*");
      const { data: roles } = await supabase.from("user_roles").select("*");
      return (profs ?? []).map(p => ({ ...p, roles: (roles ?? []).filter(r => r.user_id === p.id).map(r => r.role) }));
    },
  });

  const toggleAdmin = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => {
      if (isAdmin) {
        await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      } else {
        await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); toast({ title: "Updated!" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return (
    <div>
      <h1 className="font-recoleta text-3xl mb-8">Users & Roles</h1>
      <div className="space-y-3">
        {profiles?.map(u => {
          const isAdmin = u.roles.includes("admin");
          return (
            <div key={u.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
              {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm">{(u.full_name || "?")[0]}</div>}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{u.full_name || "Unnamed"}</p>
                <p className="text-xs text-muted-foreground">{u.roles.join(", ") || "member"}</p>
              </div>
              <button onClick={() => toggleAdmin.mutate({ userId: u.id, isAdmin })} className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors ${isAdmin ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                {isAdmin ? <ShieldCheck size={14} /> : <Shield size={14} />}
                {isAdmin ? "Admin" : "Make Admin"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UsersManager;
