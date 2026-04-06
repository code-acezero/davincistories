import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Music } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ImageUploader from "@/components/admin/ImageUploader";

const MusicManager = () => {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [trackType, setTrackType] = useState("bgm");

  const { data: tracks, isLoading } = useQuery({
    queryKey: ["admin-music"],
    queryFn: async () => {
      const { data } = await supabase.from("music_tracks").select("*").order("track_type").order("display_order");
      return data ?? [];
    },
  });

  const addTrack = useMutation({
    mutationFn: async () => {
      if (!title || !fileUrl) throw new Error("Title and file URL required");
      const { error } = await supabase.from("music_tracks").insert({ title, file_url: fileUrl, track_type: trackType });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-music"] }); setTitle(""); setFileUrl(""); toast({ title: "Track added" }); },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const toggleTrack = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("music_tracks").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-music"] }),
  });

  const deleteTrack = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("music_tracks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-music"] }); toast({ title: "Track deleted" }); },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-recoleta flex items-center gap-2"><Music size={24} /> Music Manager</h1>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <h3 className="font-medium">Add Track</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input placeholder="Track title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Select value={trackType} onValueChange={setTrackType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="bgm">Background Music</SelectItem>
              <SelectItem value="welcome">Welcome Sound</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <ImageUploader
            label={fileUrl ? "Audio uploaded ✓" : "Upload audio file"}
            value={fileUrl}
            onChange={(url) => setFileUrl(url)}
            bucket="media"
          />
        </div>
        <Button onClick={() => addTrack.mutate()} disabled={addTrack.isPending || !title || !fileUrl}>
          <Plus size={16} className="mr-1" /> Add Track
        </Button>
      </div>

      <div className="space-y-2">
        {isLoading && <p className="text-muted-foreground">Loading...</p>}
        {tracks?.map((track) => (
          <div key={track.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{track.title}</p>
              <p className="text-xs text-muted-foreground">{track.track_type === "bgm" ? "Background" : "Welcome"}</p>
            </div>
            <Switch checked={track.is_active} onCheckedChange={(v) => toggleTrack.mutate({ id: track.id, is_active: v })} />
            <Button variant="ghost" size="icon" onClick={() => deleteTrack.mutate(track.id)}>
              <Trash2 size={16} className="text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicManager;
