import { Music, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SongConfig } from '@/config/songs';
import { getTrackDotColor } from '@/config/songs';

interface TrackCardProps {
  song: SongConfig;
  index: number;
}

export function TrackCard({ song, index }: TrackCardProps) {
  // Get the dominant type from channels
  const dominantType = song.channels[0]?.type || 'other';

  return (
    <Link
      to={`/musica/${song.slug}`}
      className="group flex items-center gap-4 p-4 rounded-2xl bg-card active:scale-[0.98] transition-all duration-200 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] animate-fade-in"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      {/* Album-style icon */}
      <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-foreground group-hover:text-background group-active:bg-foreground group-active:text-background transition-colors duration-200">
        <Music className="w-6 h-6" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-semibold text-foreground truncate leading-tight">
          {song.name}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          {/* Channel type dots */}
          <div className="flex -space-x-0.5">
            {song.channels.slice(0, 5).map((ch, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${getTrackDotColor(ch.type)} ring-1 ring-card`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {song.channels.length} {song.channels.length === 1 ? 'canal' : 'canais'}
          </p>
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-foreground transition-colors flex-shrink-0" />
    </Link>
  );
}
