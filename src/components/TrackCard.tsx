import { Music, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SongConfig } from '@/config/songs';

interface TrackCardProps {
  song: SongConfig;
  index: number;
}

export function TrackCard({ song, index }: TrackCardProps) {
  return (
    <Link
      to={`/musica/${song.slug}`}
      className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all duration-200 hover:border-foreground/10 animate-fade-in"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
    >
      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-foreground group-hover:text-background transition-colors duration-200">
        <Music className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-foreground truncate">{song.name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {song.channels.length} {song.channels.length === 1 ? 'canal' : 'canais'}
        </p>
      </div>

      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
    </Link>
  );
}
