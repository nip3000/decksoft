import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  audioData: string;
  initialDuration?: number;
  className?: string;
}

const formatTime = (seconds: number): string => {
  if (!isFinite(seconds) || isNaN(seconds)) {
    return "0:00";
  }
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

const AudioPlayer = ({ audioData, initialDuration, className }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDuration || 0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const audio = new Audio(`data:audio/webm;base64,${audioData}`);
    audioRef.current = audio;

    const handleMetadata = () => {
      if (isFinite(audio.duration) && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleDurationChange = () => {
      if (isFinite(audio.duration) && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener("loadedmetadata", handleMetadata);
    audio.addEventListener("durationchange", handleDurationChange);

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
      // Fallback: get duration from timeupdate if still unknown
      if (duration === 0 && isFinite(audio.duration) && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
      // Set final duration when audio ends if we didn't have it
      if (duration === 0 && isFinite(audio.currentTime) && audio.currentTime > 0) {
        setDuration(audio.currentTime);
      }
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
          {formatTime(currentTime)}{duration > 0 ? ` / ${formatTime(duration)}` : ""}
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;
