import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ScrollText, Filter, RefreshCw } from "lucide-react";

type AuditEntry = {
  id: string;
  event_type: string;
  actor_id: string | null;
  actor_email: string | null;
  target_id: string | null;
  target_label: string | null;
  metadata: any;
  created_at: string;
};

const EVENT_GROUPS: Record<string, string> = {
  "role.": "Role changes",
  "auth.": "OAuth & sign-in",
  "admin.": "Admin actions",
  "blog_posts.": "Blog publishing",
  "gallery_images.": "Gallery publishing",
};

const labelOf = (t: string) => {
  for (const k of Object.keys(EVENT_GROUPS)) if (t.startsWith(k)) return EVENT_GROUPS[k];
  return "Other";
};

const colorOf = (t: string) => {
  if (t.startsWith("role.granted")) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  if (t.startsWith("role.revoked")) return "text-red-400 bg-red-500/10 border-red-500/30";
  if (t.startsWith("auth.oauth_success") || t.endsWith(".published")) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  if (t.startsWith("auth.oauth_failure")) return "text-red-400 bg-red-500/10 border-red-500/30";
  if (t.startsWith("auth.")) return "text-sky-400 bg-sky-500/10 border-sky-500/30";
  if (t.startsWith("admin.")) return "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30";
  if (t.endsWith(".review")) return "text-amber-400 bg-amber-500/10 border-amber-500/30";
  return "text-muted-foreground bg-muted/30 border-border";
};

const AuditLog = () => {
  const [filter, setFilter] = useState<string>("all");

  const { data, refetch, isFetching } = useQuery<AuditEntry[]>({
    queryKey: ["audit-log"],
    queryFn: async () => {
      const { data } = await supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(500);
      return (data ?? []) as AuditEntry[];
    },
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data;
    return data.filter(e => e.event_type.startsWith(filter));
  }, [data, filter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <ScrollText className="text-primary" />
          <div>
            <h1 className="font-recoleta text-3xl">Audit Log</h1>
            <p className="text-xs text-muted-foreground mt-1">Tracks role changes, OAuth attempts, bootstrap actions, and publish events.</p>
          </div>
        </div>
        <button onClick={() => refetch()} className="glass-card border border-border rounded-xl px-3 py-2 text-sm flex items-center gap-2 hover:border-primary/30">
          <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="glass-card rounded-2xl p-3 mb-4 flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-muted-foreground ml-2" />
        {[
          { id: "all", label: "All" },
          { id: "role.", label: "Roles" },
          { id: "auth.", label: "Auth" },
          { id: "admin.", label: "Admin" },
          { id: "blog_posts.", label: "Blog" },
          { id: "gallery_images.", label: "Gallery" },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${filter === f.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">When</th>
              <th className="text-left px-4 py-3">Event</th>
              <th className="text-left px-4 py-3">Actor</th>
              <th className="text-left px-4 py-3">Target</th>
              <th className="text-left px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">No audit entries yet.</td></tr>
            )}
            {filtered.map(e => (
              <tr key={e.id} className="border-t border-border/40 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                  <div>{format(new Date(e.created_at), "MMM dd, yyyy")}</div>
                  <div>{format(new Date(e.created_at), "HH:mm:ss")}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wider border ${colorOf(e.event_type)}`}>
                    {e.event_type}
                  </span>
                  <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{labelOf(e.event_type)}</div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{e.actor_email || (e.actor_id ? e.actor_id.slice(0, 8) + "…" : "system")}</td>
                <td className="px-4 py-3 text-xs">{e.target_label || (e.target_id ? e.target_id.slice(0, 8) + "…" : "—")}</td>
                <td className="px-4 py-3 text-[11px] text-muted-foreground font-mono max-w-xs truncate">{e.metadata && Object.keys(e.metadata).length > 0 ? JSON.stringify(e.metadata) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLog;
