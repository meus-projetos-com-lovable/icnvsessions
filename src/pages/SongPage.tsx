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
      <div className="min-h-screen bg-background flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-foreground font-medium mb-2">Música não encontrada</p>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Voltar à biblioteca
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
      {/* iOS-style header with blur */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 flex-shrink-0">
        <div className="max-w-lg mx-auto px-5 pt-[env(safe-area-inset-top)] pb-0">
          <div className="flex items-center gap-3 py-3">
            <Link
              to="/"
              className="btn-press w-10 h-10 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-accent active:bg-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img src={logo} alt="ICNV Sessions" className="w-9 h-9 rounded-xl object-cover ring-1 ring-border/30 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-base font-bold text-foreground truncate tracking-tight font-display leading-tight">
                  {song.name}
                </h1>
                {isLoading && (
                  <p className="text-[11px] text-muted-foreground">Carregando áudio...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mixer channels — scrollable area */}
      <main className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-lg mx-auto px-5 py-5 pb-48 sm:pb-40">
          <Mixer
            channels={channelStates}
            onVolumeChange={setVolume}
            onToggleMute={toggleMute}
            onToggleSolo={toggleSolo}
          />
        </div>
      </main>

      {/* Sticky bottom transport — iOS Now Playing style */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-2xl border-t border-border/50">
        <div className="max-w-lg mx-auto px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <ProgressBar currentTime={currentTime} duration={duration} onSeek={seek} />
          <div className="mt-1">
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
        </div>
      </div>
    </div>
  );
}
