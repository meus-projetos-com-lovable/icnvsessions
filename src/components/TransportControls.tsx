import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface TransportControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  onTogglePlayPause: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function TransportControls({
  isPlaying,
  isLoading,
  currentTime,
  duration,
  onTogglePlayPause,
  onSkipForward,
  onSkipBackward,
}: TransportControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onSkipBackward}
        className="btn-press w-10 h-10 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-accent transition-colors"
        title="Skip back 10s"
      >
        <SkipBack className="w-4 h-4" />
      </button>

      <button
        onClick={onTogglePlayPause}
        disabled={isLoading}
        className="btn-press w-12 h-12 rounded-xl bg-foreground text-background flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40"
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5 ml-0.5" />
        )}
      </button>

      <button
        onClick={onSkipForward}
        className="btn-press w-10 h-10 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-accent transition-colors"
        title="Skip forward 10s"
      >
        <SkipForward className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-1.5 ml-2">
        <span className="font-mono-ui text-xs text-foreground">{formatTime(currentTime)}</span>
        <span className="text-xs text-muted-foreground">/</span>
        <span className="font-mono-ui text-xs text-muted-foreground">{formatTime(duration)}</span>
      </div>
    </div>
  );
}
