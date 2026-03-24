import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import logo from '@/assets/logo.png';
import { getSongBySlug } from '@/config/songs';
import { useMultiTrackPlayer } from '@/hooks/useMultiTrackPlayer';
import { Mixer } from '@/components/Mixer';
import { TransportControls } from '@/components/TransportControls';
import { ProgressBar } from '@/components/ProgressBar';

export default function SongPage() {
  const { slug } = useParams<{ slug: string }>();
  const song = getSongBySlug(slug || '');

  if (!song) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground font-medium mb-2">Song not found</p>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to library
          </Link>
        </div>
      </div>
    );
  }

  return <SongPlayer song={song} />;
}

function SongPlayer({ song }: { song: NonNullable<ReturnType<typeof getSongBySlug>> }) {
  const {
    isPlaying,
    isLoading,
    currentTime,
    duration,
    channelStates,
    togglePlayPause,
    seek,
    skipForward,
    skipBackward,
    setVolume,
    toggleMute,
    toggleSolo,
  } = useMultiTrackPlayer(song.channels);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border flex-shrink-0">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="btn-press w-8 h-8 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img src={logo} alt="ICNV Sessions" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-base font-semibold text-foreground truncate tracking-tight">
                {song.name}
              </h1>
              {isLoading && (
                <p className="text-xs text-muted-foreground">Loading audio...</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Transport + Progress */}
      <div className="border-b border-border flex-shrink-0">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center gap-6">
            <TransportControls
              isPlaying={isPlaying}
              isLoading={isLoading}
              currentTime={currentTime}
              duration={duration}
              onTogglePlayPause={togglePlayPause}
              onSkipForward={skipForward}
              onSkipBackward={skipBackward}
            />
          </div>
          <div className="mt-2">
            <ProgressBar currentTime={currentTime} duration={duration} onSeek={seek} />
          </div>
        </div>
      </div>

      {/* Mixer */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <Mixer
            channels={channelStates}
            onVolumeChange={setVolume}
            onToggleMute={toggleMute}
            onToggleSolo={toggleSolo}
          />
        </div>
      </main>
    </div>
  );
}
