import { TrackCard } from './TrackCard';
import type { SongConfig } from '@/config/songs';

interface TrackListProps {
  songs: SongConfig[];
}

export function TrackList({ songs }: TrackListProps) {
  if (songs.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-sm">Your setlist is quiet.</p>
        <p className="text-muted-foreground text-xs mt-1">Add songs to /public/musicas/ to begin.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {songs.map((song, i) => (
        <TrackCard key={song.slug} song={song} index={i} />
      ))}
    </div>
  );
}
