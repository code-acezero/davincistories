import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Save, Plus } from "lucide-react";

const defaultSettings = [
  { key: "site_name", label: "Site Name", default: "DaVinci Stories" },
  { key: "site_tagline", label: "Tagline", default: "Make Your Imaginations Into Reality" },
  { key: "about_title", label: "About Title", default: "About DaVinci Stories" },
  { key: "about_description", label: "About Description", default: "" },
  { key: "about_quote", label: "About Quote", default: "" },
  { key: "about_image", label: "About Image URL", default: "" },
  { key: "contact_email", label: "Contact Email", default: "davincistories@gmail.com" },
  { key: "contact_phone", label: "Contact Phone", default: "+8801603327099" },
  { key: "contact_address", label: "Address", default: "Khoksa, Kushtia, Khulna, Bangladesh" },
  { key: "facebook_url", label: "Facebook URL", default: "" },
  { key: "instagram_url", label: "Instagram URL", default: "" },
  { key: "youtube_url", label: "YouTube URL", default: "" },
];

const SettingsManager = () => {
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*");
      const map: Record<string, string> = {};
      data?.forEach(s => { map[s.key] = typeof s.value === 'string' ? s.value : JSON.stringify(s.value); });
      setValues(map);
      return map;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      for (const setting of defaultSettings) {
        const val = values[setting.key] ?? setting.default;
        await supabase.from("site_settings").upsert({ key: setting.key, value: JSON.stringify(val) }, { onConflict: "key" });
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-settings"] }); toast({ title: "Settings saved!" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (isLoading) return <div className="animate-pulse h-96 bg-muted rounded-2xl" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-recoleta text-3xl">Site Settings</h1>
        <button onClick={() => save.mutate()} className="bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm flex items-center gap-2 btn-glow"><Save size={16} /> Save All</button>
      </div>
      <div className="glass-card rounded-2xl p-6 space-y-4">
        {defaultSettings.map(s => (
          <div key={s.key}>
            <label className="text-sm text-foreground/70 mb-1 block">{s.label}</label>
            {s.key.includes("description") || s.key.includes("quote") ? (
              <textarea value={values[s.key] ?? s.default} onChange={e => setValues(v => ({ ...v, [s.key]: e.target.value }))} rows={3} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground resize-none" />
            ) : (
              <input value={values[s.key] ?? s.default} onChange={e => setValues(v => ({ ...v, [s.key]: e.target.value }))} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsManager;
