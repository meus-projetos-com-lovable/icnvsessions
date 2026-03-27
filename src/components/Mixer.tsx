import { ChannelStrip } from './ChannelStrip';
import type { ChannelState } from '@/hooks/useMultiTrackPlayer';
import { Sliders } from 'lucide-react';

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
        Nenhum canal disponível
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 px-1 mb-4">
        <Sliders className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground tracking-tight">Mixer</h2>
        <span className="ml-auto font-mono-ui text-xs text-muted-foreground">
          {channels.length} canais
        </span>
      </div>
      <div className="space-y-3">
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
