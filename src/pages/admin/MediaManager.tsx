import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { Upload, Trash2, Copy } from "lucide-react";

const MediaManager = () => {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data: files } = useQuery({
    queryKey: ["admin-media"],
    queryFn: async () => {
      const { data } = await supabase.storage.from("media").list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
      return data ?? [];
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    setUploading(true);
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      await supabase.storage.from("media").upload(path, file);
    }
    setUploading(false);
    qc.invalidateQueries({ queryKey: ["admin-media"] });
    toast({ title: "Uploaded!" });
  };

  const handleDelete = async (name: string) => {
    if (!confirm("Delete this file?")) return;
    await supabase.storage.from("media").remove([name]);
    qc.invalidateQueries({ queryKey: ["admin-media"] });
    toast({ title: "Deleted" });
  };

  const getUrl = (name: string) => supabase.storage.from("media").getPublicUrl(name).data.publicUrl;

  const copyUrl = (name: string) => {
    navigator.clipboard.writeText(getUrl(name));
    toast({ title: "URL copied!" });
  };

  const isImage = (name: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-recoleta text-3xl">Media Library</h1>
        <button onClick={() => inputRef.current?.click()} disabled={uploading} className="bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm flex items-center gap-2 btn-glow">
          <Upload size={16} /> {uploading ? "Uploading..." : "Upload Files"}
        </button>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={handleUpload} />
      </div>
      <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {files?.map(f => (
          <div key={f.name} className="glass-card rounded-xl overflow-hidden group relative">
            {isImage(f.name) ? (
              <img src={getUrl(f.name)} alt={f.name} className="w-full aspect-square object-cover" loading="lazy" />
            ) : (
              <div className="w-full aspect-square bg-muted flex items-center justify-center text-muted-foreground text-xs p-2 text-center break-all">{f.name}</div>
            )}
            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button onClick={() => copyUrl(f.name)} className="bg-primary text-primary-foreground rounded-full p-2"><Copy size={14} /></button>
              <button onClick={() => handleDelete(f.name)} className="bg-destructive text-destructive-foreground rounded-full p-2"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaManager;
