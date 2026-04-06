import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Mail, MailOpen, Trash2 } from "lucide-react";

const MessagesManager = () => {
  const qc = useQueryClient();
  const { data: messages } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => { const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false }); return data ?? []; },
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => { await supabase.from("contact_messages").update({ is_read: true }).eq("id", id); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-messages"] }),
  });

  const del = useMutation({ mutationFn: async (id: string) => { await supabase.from("contact_messages").delete().eq("id", id); }, onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-messages"] }); } });

  return (
    <div>
      <h1 className="font-recoleta text-3xl mb-8">Messages</h1>
      <div className="space-y-3">
        {messages?.map(msg => (
          <div key={msg.id} className={`glass-card rounded-xl p-4 ${!msg.is_read ? "border-l-4 border-l-primary" : ""}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{msg.name}</p>
                  {!msg.is_read && <span className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <p className="text-sm text-muted-foreground">{msg.email}</p>
                {msg.subject && <p className="text-sm font-medium mt-1">{msg.subject}</p>}
                <p className="text-sm text-foreground/70 mt-1">{msg.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{format(new Date(msg.created_at), "MMM dd, yyyy HH:mm")}</p>
              </div>
              <div className="flex gap-2">
                {!msg.is_read && <button onClick={() => markRead.mutate(msg.id)} className="text-muted-foreground hover:text-foreground" title="Mark as read"><MailOpen size={16} /></button>}
                <button onClick={() => { if (confirm("Delete?")) del.mutate(msg.id); }} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
        {(!messages || messages.length === 0) && <p className="text-center text-muted-foreground py-8">No messages yet.</p>}
      </div>
    </div>
  );
};

export default MessagesManager;
