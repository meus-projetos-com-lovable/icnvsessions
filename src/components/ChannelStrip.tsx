import { Volume2, VolumeX, Headphones } from 'lucide-react';
import type { ChannelState } from '@/hooks/useMultiTrackPlayer';
import { getTrackColor, getTrackDotColor, type ChannelConfig } from '@/config/songs';

interface ChannelStripProps {
  channel: ChannelState;
  index: number;
  onVolumeChange: (index: number, volume: number) => void;
  onToggleMute: (index: number) => void;
  onToggleSolo: (index: number) => void;
}

export function ChannelStrip({
  channel,
  index,
  onVolumeChange,
  onToggleMute,
  onToggleSolo,
}: ChannelStripProps) {
  const trackBg = getTrackColor(channel.type);
  const dotColor = getTrackDotColor(channel.type);
  const isActive = !channel.muted && channel.loaded;
  const isSoloed = channel.soloed;

  return (
    <div
      className={`
        flex items-center gap-4 px-4 py-3 rounded-lg border transition-all duration-200
        ${isActive ? 'border-border bg-card' : 'border-border/50 bg-muted/30 opacity-60'}
        ${isSoloed ? 'ring-2 ring-solo/50 border-solo/30' : ''}
      `}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Track indicator */}
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />

      {/* Channel name */}
      <div className="min-w-[120px]">
        <span className="text-sm font-medium text-foreground">{channel.name}</span>
        {!channel.loaded && (
          <span className="block text-xs text-muted-foreground">Carregando...</span>
        )}
      </div>

      {/* Volume slider */}
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <input
          type="range"
          min="0"
          max="100"
          value={channel.volume}
          onChange={(e) => onVolumeChange(index, Number(e.target.value))}
          className="channel-fader flex-1"
          disabled={!channel.loaded}
        />
        <span className="font-mono-ui text-xs text-muted-foreground w-8 text-right tabular-nums">
          {channel.volume}
        </span>
      </div>

      {/* Mute button */}
      <button
        onClick={() => onToggleMute(index)}
        className={`
          btn-press w-8 h-8 rounded flex items-center justify-center text-xs font-medium
          transition-colors duration-150
          ${channel.muted
            ? 'bg-destructive text-destructive-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-accent'
          }
        `}
        title={channel.muted ? 'Unmute' : 'Mute'}
      >
        {channel.muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>

      {/* Solo button */}
      <button
        onClick={() => onToggleSolo(index)}
        className={`
          btn-press w-8 h-8 rounded flex items-center justify-center text-xs font-semibold
          transition-colors duration-150
          ${channel.soloed
            ? 'bg-solo text-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-accent'
          }
        `}
        title={channel.soloed ? 'Unsolo' : 'Solo'}
      >
        <Headphones className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
