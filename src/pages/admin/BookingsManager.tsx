import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Check, X, Trash2 } from "lucide-react";

const BookingsManager = () => {
  const qc = useQueryClient();
  const { data: bookings } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => { const { data } = await supabase.from("bookings").select("*, services(title)").order("created_at", { ascending: false }); return data ?? []; },
  });

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => { const { error } = await supabase.from("bookings").update({ status }).eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-bookings"] }); toast({ title: "Updated!" }); },
  });

  const del = useMutation({ mutationFn: async (id: string) => { await supabase.from("bookings").delete().eq("id", id); }, onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-bookings"] }); } });

  const statusColor = (s: string) => s === "confirmed" ? "text-green-400 bg-green-400/10" : s === "cancelled" ? "text-destructive bg-destructive/10" : "text-gold bg-gold/10";

  return (
    <div>
      <h1 className="font-recoleta text-3xl mb-8">Bookings</h1>
      <div className="space-y-3">
        {bookings?.map(b => (
          <div key={b.id} className="glass-card rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium">{b.name}</p>
                <p className="text-sm text-muted-foreground">{b.email} · {b.phone}</p>
                {(b as any).services?.title && <p className="text-sm text-primary">{(b as any).services.title}</p>}
                {b.preferred_date && <p className="text-xs text-muted-foreground">{format(new Date(b.preferred_date), "MMM dd, yyyy")}</p>}
                {b.message && <p className="text-sm text-foreground/70 mt-1">{b.message}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor(b.status)}`}>{b.status}</span>
                {b.status === "pending" && (
                  <>
                    <button onClick={() => update.mutate({ id: b.id, status: "confirmed" })} className="text-green-400 hover:bg-green-400/10 rounded-full p-1"><Check size={16} /></button>
                    <button onClick={() => update.mutate({ id: b.id, status: "cancelled" })} className="text-destructive hover:bg-destructive/10 rounded-full p-1"><X size={16} /></button>
                  </>
                )}
                <button onClick={() => { if (confirm("Delete?")) del.mutate(b.id); }} className="text-muted-foreground hover:text-destructive rounded-full p-1"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
        {(!bookings || bookings.length === 0) && <p className="text-center text-muted-foreground py-8">No bookings yet.</p>}
      </div>
    </div>
  );
};

export default BookingsManager;
