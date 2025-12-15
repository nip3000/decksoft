import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  audioData: string;
  className?: string;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const WaveformBars = ({ isPlaying, progress }: { isPlaying: boolean; progress: number }) => {
  const barCount = 20;
  
  return (
    <div className="flex items-center gap-[2px] h-6 flex-1">
      {Array.from({ length: barCount }).map((_, i) => {
        const barProgress = (i / barCount) * 100;
        const isPast = barProgress < progress;
        
        return (
          <div
            key={i}
            className={cn(
              "w-[3px] rounded-full transition-all duration-150",
              isPast ? "bg-primary-foreground" : "bg-primary-foreground/40",
              isPlaying && "animate-waveform"
            )}
            style={{
              height: isPlaying 
                ? `${Math.random() * 60 + 40}%` 
                : `${((Math.sin(i * 0.5) + 1) / 2) * 60 + 20}%`,
              animationDelay: isPlaying ? `${i * 50}ms` : "0ms",
            }}
          />
        );
      })}
    </div>
  );
};

const AudioPlayer = ({ audioData, className }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const audio = new Audio(`data:audio/webm;base64,${audioData}`);
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [audioData]);

  // Force re-render for waveform animation while playing
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      forceUpdate(n => n + 1);
    }, 150);
    
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={cn("flex items-center gap-3 min-w-[200px]", className)}>
      <button
        onClick={togglePlay}
        className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors flex-shrink-0"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
        )}
      </button>

      <div className="flex-1 flex flex-col gap-1">
        <div
          className="cursor-pointer"
          onClick={handleWaveformClick}
        >
          <WaveformBars isPlaying={isPlaying} progress={progress} />
        </div>
        <span className="text-xs text-primary-foreground/80">
          {formatTime(currentTime)} / {formatTime(duration || 0)}
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;
