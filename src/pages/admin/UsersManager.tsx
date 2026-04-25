import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Shield, ShieldCheck, ShieldAlert, Search, User as UserIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type Role = "admin" | "moderator" | "member";
const ALL_ROLES: Role[] = ["admin", "moderator", "member"];

const roleStyles: Record<Role, { bg: string; text: string; icon: typeof Shield; label: string }> = {
  admin: { bg: "bg-primary/15 border-primary/40", text: "text-primary", icon: ShieldCheck, label: "Admin" },
  moderator: { bg: "bg-copper/15 border-copper/40", text: "text-copper", icon: ShieldAlert, label: "Moderator" },
  member: { bg: "bg-muted/40 border-border", text: "text-muted-foreground", icon: Shield, label: "Member" },
};

const UsersManager = () => {
  const qc = useQueryClient();
  const { user: me } = useAuth();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | Role>("all");

  const { data: profiles, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profs } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      const { data: roles } = await supabase.from("user_roles").select("*");
      return (profs ?? []).map((p) => ({
        ...p,
        roles: ((roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role) as Role[]),
      }));
    },
  });

  const toggleRole = useMutation({
    mutationFn: async ({ userId, role, currentlyHas }: { userId: string; role: Role; currentlyHas: boolean }) => {
      if (currentlyHas) {
        const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
        if (error) throw error;
      }
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast({
        title: vars.currentlyHas ? "Role revoked" : "Role granted",
        description: `${vars.role} ${vars.currentlyHas ? "removed from" : "granted to"} user.`,
      });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const filtered = useMemo(() => {
    if (!profiles) return [];
    return profiles.filter((u) => {
      const q = query.trim().toLowerCase();
      const matchQ = !q || (u.full_name || "").toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
      const matchF = filter === "all" || u.roles.includes(filter);
      return matchQ && matchF;
    });
  }, [profiles, query, filter]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-recoleta text-3xl">Users &amp; Roles</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Grant or revoke admin/moderator access. Members are users without elevated roles.
        </p>
      </header>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or user ID…"
            className="w-full glass-card rounded-xl pl-10 pr-4 py-2.5 text-sm bg-transparent outline-none focus:border-primary/40"
          />
        </div>
        <div className="flex gap-1.5 glass-card rounded-xl p-1">
          {(["all", ...ALL_ROLES] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors ${
                filter === f ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "All" : roleStyles[f].label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="animate-spin w-5 h-5 mr-2" /> Loading users…
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">
          No users match your filters.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((u) => {
            const isMe = u.id === me?.id;
            const hasAdmin = u.roles.includes("admin");
            return (
              <div key={u.id} className="glass-card rounded-2xl p-4 flex flex-wrap items-center gap-4">
                {u.avatar_url ? (
                  <img src={u.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                    <UserIcon size={18} />
                  </div>
                )}
                <div className="flex-1 min-w-[180px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium">{u.full_name || "Unnamed user"}</p>
                    {isMe && <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/20 text-secondary">You</span>}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono truncate">{u.id}</p>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {u.roles.length === 0 && (
                      <span className="text-[10px] text-muted-foreground/70 italic">no role</span>
                    )}
                    {u.roles.map((r) => {
                      const style = roleStyles[r] ?? roleStyles.member;
                      const Icon = style.icon;
                      return (
                        <span
                          key={r}
                          className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${style.bg} ${style.text}`}
                        >
                          <Icon size={10} /> {style.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Role toggle buttons */}
                <div className="flex gap-2 flex-wrap">
                  {ALL_ROLES.filter((r) => r !== "member").map((role) => {
                    const has = u.roles.includes(role);
                    const style = roleStyles[role];
                    const Icon = style.icon;
                    const dangerous = isMe && role === "admin" && has; // self-revoke admin
                    return (
                      <button
                        key={role}
                        disabled={toggleRole.isPending}
                        onClick={() => {
                          if (dangerous) {
                            const ok = confirm("You are about to revoke your own admin role. You'll lose access to /master immediately. Continue?");
                            if (!ok) return;
                          }
                          toggleRole.mutate({ userId: u.id, role, currentlyHas: has });
                        }}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                          has
                            ? `${style.bg} ${style.text} hover:opacity-80`
                            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        } disabled:opacity-50`}
                        title={has ? `Revoke ${style.label}` : `Grant ${style.label}`}
                      >
                        <Icon size={12} />
                        {has ? `Revoke ${style.label}` : `Make ${style.label}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[11px] text-muted-foreground/60">
        Tip: All role checks are enforced server-side via the <code className="text-foreground/70">user_roles</code> table and <code className="text-foreground/70">has_role()</code> RLS function — clients can never bypass them.
      </p>
    </div>
  );
};

export default UsersManager;
