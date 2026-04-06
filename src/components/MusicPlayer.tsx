import { useState, useRef, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Volume2, VolumeX } from "lucide-react";

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const [started, setStarted] = useState(false);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  const { data: tracks } = useQuery({
    queryKey: ["music-tracks"],
    queryFn: async () => {
      const { data } = await supabase
        .from("music_tracks")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      return data ?? [];
    },
  });

  const bgmTracks = tracks?.filter(t => t.track_type === "bgm") ?? [];
  const welcomeTracks = tracks?.filter(t => t.track_type === "welcome") ?? [];

  const playNextBGM = useCallback(() => {
    if (bgmTracks.length === 0) return;
    if (bgmRef.current) bgmRef.current.pause();
    const track = getRandomItem(bgmTracks);
    const audio = new Audio(track.file_url);
    audio.volume = 0.3;
    audio.addEventListener("ended", playNextBGM);
    audio.play().catch(() => {});
    bgmRef.current = audio;
    setIsPlaying(true);
  }, [bgmTracks]);

  const startMusic = useCallback(() => {
    if (started) return;
    setStarted(true);
    if (welcomeTracks.length > 0) {
      const welcome = new Audio(getRandomItem(welcomeTracks).file_url);
      welcome.volume = 0.4;
      welcome.play().catch(() => {});
      setTimeout(playNextBGM, 1500);
    } else {
      playNextBGM();
    }
    setTimeout(() => setVisible(true), 3000);
  }, [started, welcomeTracks, playNextBGM]);

  useEffect(() => {
    window.addEventListener("davinci-enter", startMusic);
    return () => {
      window.removeEventListener("davinci-enter", startMusic);
      bgmRef.current?.pause();
    };
  }, [startMusic]);

  const togglePlayPause = () => {
    if (!bgmRef.current) return;
    if (isPlaying) {
      bgmRef.current.pause();
    } else {
      bgmRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  if (!visible) return null;

  return (
    <button
      onClick={togglePlayPause}
      className="fixed bottom-5 right-5 z-[10000] w-12 h-12 rounded-full glass-card-strong flex items-center justify-center shadow-lg group hover:scale-110 transition-all duration-300"
      style={{ animation: "beat 3s infinite" }}
      aria-label={isPlaying ? "Pause music" : "Play music"}
    >
      {isPlaying ? (
        <Volume2 size={18} className="text-primary group-hover:text-foreground transition-colors" />
      ) : (
        <VolumeX size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
      )}
      {/* Pulse ring */}
      {isPlaying && (
        <span className="absolute inset-0 rounded-full border border-primary/30 animate-ping" />
      )}
    </button>
  );
};

export default MusicPlayer;
