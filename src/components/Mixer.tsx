import { ChannelStrip } from './ChannelStrip';
import type { ChannelState } from '@/hooks/useMultiTrackPlayer';

interface MixerProps {
  channels: ChannelState[];
  onVolumeChange: (index: number, volume: number) => void;
  onToggleMute: (index: number) => void;
  onToggleSolo: (index: number) => void;
}

export function Mixer({ channels, onVolumeChange, onToggleMute, onToggleSolo }: MixerProps) {
  if (channels.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No channels available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1 mb-3">
        <h2 className="text-sm font-semibold text-foreground tracking-tight">Mixer</h2>
        <span className="font-mono-ui text-xs text-muted-foreground">
          {channels.length} channels
        </span>
      </div>
      <div className="space-y-1.5">
        {channels.map((channel, index) => (
          <ChannelStrip
            key={index}
            channel={channel}
            index={index}
            onVolumeChange={onVolumeChange}
            onToggleMute={onToggleMute}
            onToggleSolo={onToggleSolo}
          />
        ))}
      </div>
    </div>
  );
}
