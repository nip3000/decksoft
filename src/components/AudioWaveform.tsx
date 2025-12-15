import { cn } from "@/lib/utils";

interface AudioWaveformProps {
  className?: string;
  barCount?: number;
}

const AudioWaveform = ({ className, barCount = 5 }: AudioWaveformProps) => {
  return (
    <div className={cn("flex items-center gap-0.5 h-4", className)}>
      {Array.from({ length: barCount }).map((_, i) => (
        <span
          key={i}
          className="w-1 bg-destructive rounded-full animate-waveform"
          style={{
            animationDelay: `${i * 0.1}s`,
            height: "100%",
          }}
        />
      ))}
    </div>
  );
};

export default AudioWaveform;
