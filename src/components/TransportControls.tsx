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
    <div className="flex items-center justify-between">
      {/* Time left */}
      <span className="font-mono-ui text-xs text-muted-foreground w-12 tabular-nums">
        {formatTime(currentTime)}
      </span>

      {/* Center controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={onSkipBackward}
          className="btn-press w-12 h-12 rounded-2xl flex items-center justify-center text-foreground active:text-muted-foreground transition-colors"
          title="Voltar 10s"
        >
          <SkipBack className="w-6 h-6" />
        </button>

        <button
          onClick={onTogglePlayPause}
          disabled={isLoading}
          className="btn-press w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg active:shadow-md transition-all disabled:opacity-40"
          title={isPlaying ? 'Pausar' : 'Reproduzir'}
        >
          {isPlaying ? (
            <Pause className="w-7 h-7" />
          ) : (
            <Play className="w-7 h-7 ml-1" />
          )}
        </button>

        <button
          onClick={onSkipForward}
          className="btn-press w-12 h-12 rounded-2xl flex items-center justify-center text-foreground active:text-muted-foreground transition-colors"
          title="Avançar 10s"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      {/* Time right */}
      <span className="font-mono-ui text-xs text-muted-foreground w-12 text-right tabular-nums">
        {formatTime(duration)}
      </span>
    </div>
  );
}
