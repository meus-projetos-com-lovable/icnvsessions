import { Volume2, VolumeX, Headphones } from 'lucide-react';
import type { ChannelState } from '@/hooks/useMultiTrackPlayer';
import { getTrackDotColor } from '@/config/songs';

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
  const dotColor = getTrackDotColor(channel.type);
  const isActive = !channel.muted && channel.loaded;
  const isSoloed = channel.soloed;

  return (
    <div
      className={`
        rounded-2xl border p-4 transition-all duration-200 animate-fade-in
        ${isActive ? 'border-border/60 bg-card shadow-[var(--shadow-sm)]' : 'border-border/30 bg-muted/20 opacity-50'}
        ${isSoloed ? 'ring-2 ring-solo/40 border-solo/30 shadow-[var(--shadow-md)]' : ''}
      `}
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
    >
      {/* Top row: name + buttons */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotColor}`} />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-foreground truncate block leading-tight">
            {channel.name}
          </span>
          {!channel.loaded && (
            <span className="text-[11px] text-muted-foreground">Carregando...</span>
          )}
        </div>

        {/* Mute button */}
        <button
          onClick={() => onToggleMute(index)}
          className={`
            btn-press w-10 h-10 rounded-xl flex items-center justify-center
            transition-colors duration-150
            ${channel.muted
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-secondary text-secondary-foreground active:bg-accent'
            }
          `}
          title={channel.muted ? 'Ativar' : 'Mutar'}
        >
          {channel.muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Solo button */}
        <button
          onClick={() => onToggleSolo(index)}
          className={`
            btn-press w-10 h-10 rounded-xl flex items-center justify-center
            transition-colors duration-150
            ${channel.soloed
              ? 'bg-solo text-foreground'
              : 'bg-secondary text-secondary-foreground active:bg-accent'
            }
          `}
          title={channel.soloed ? 'Desativar solo' : 'Solo'}
        >
          <Headphones className="w-4 h-4" />
        </button>
      </div>

      {/* Volume slider — full width for easy mobile touch */}
      <div className="flex items-center gap-3">
        <input
          type="range"
          min="0"
          max="100"
          value={channel.volume}
          onChange={(e) => onVolumeChange(index, Number(e.target.value))}
          className="channel-fader flex-1"
          disabled={!channel.loaded}
        />
        <span className="font-mono-ui text-[11px] text-muted-foreground w-8 text-right tabular-nums">
          {channel.volume}
        </span>
      </div>
    </div>
  );
}
