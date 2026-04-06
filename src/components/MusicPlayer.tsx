import { useState, useRef, useEffect, useCallback } from "react";

const bgmFiles = Array.from({ length: 13 }, (_, i) => `/music/bgm${i + 1}.mp3`);
const welcomeFiles = ["/music/welcome1.mp3", "/music/welcome2.mp3"];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  const playNextBGM = useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.pause();
    }
    const audio = new Audio(getRandomItem(bgmFiles));
    audio.addEventListener("ended", playNextBGM);
    audio.play().catch(() => {});
    bgmRef.current = audio;
    setIsPlaying(true);
  }, []);

  const startMusic = useCallback(() => {
    const welcome = new Audio(getRandomItem(welcomeFiles));
    welcome.play().catch(() => {});
    setTimeout(playNextBGM, 1000);
    setTimeout(() => setVisible(true), 5000);
  }, [playNextBGM]);

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
      className="fixed bottom-5 right-5 z-[10000] w-[50px] h-[50px] rounded-full bg-foreground flex items-center justify-center shadow-lg transition-opacity duration-[5s]"
      style={{ animation: "beat 3s infinite" }}
      aria-label={isPlaying ? "Pause music" : "Play music"}
    >
      {isPlaying ? (
        <img src="/images/pause.svg" width={24} height={24} alt="pause" />
      ) : (
        <img src="/images/heart.svg" width={24} height={24} alt="play" />
      )}
    </button>
  );
};

export default MusicPlayer;
