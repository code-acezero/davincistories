import { supabase } from "@/integrations/supabase/client";
import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
}

const ImageUploader = ({ label, value, onChange, bucket = "media" }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) {
      console.error("Upload error:", error);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  };

  return (
    <div>
      <label className="text-sm text-foreground/70 mb-1 block">{label}</label>
      {value ? (
        <div className="relative group">
          <img src={value} alt="" className="w-full h-32 object-cover rounded-lg" />
          <button onClick={() => onChange("")} className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <X size={14} />
          </button>
        </div>
      ) : (
        <button onClick={() => inputRef.current?.click()} disabled={uploading} className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all">
          <Upload size={20} />
          <span className="text-xs">{uploading ? "Uploading..." : "Click to upload"}</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} />
    </div>
  );
};

export default ImageUploader;
