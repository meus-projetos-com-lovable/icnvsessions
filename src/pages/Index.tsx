import { TrackList } from '@/components/TrackList';
import { songs } from '@/config/songs';
import logo from '@/assets/logo.png';
import { Music } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* iOS-style sticky header with blur */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-5 pt-[env(safe-area-inset-top)] pb-0">
          <div className="flex items-center gap-3.5 py-4">
            <img
              src={logo}
              alt="ICNV Sessions"
              className="w-14 h-14 rounded-2xl object-cover ring-1 ring-border/30 shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-foreground tracking-tight font-display">
                ICNV Sessions
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">Ele move ainda hoje</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content area */}
      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-6">
        {/* Section header — Apple Music style */}
        <div className="flex items-center gap-2 mb-4 px-1">
          <Music className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground tracking-tight">Músicas</h2>
          <span className="ml-auto text-xs text-muted-foreground font-mono-ui">{songs.length}</span>
        </div>
        <TrackList songs={songs} />
      </main>

      {/* Bottom safe area spacer for mobile */}
      <div className="pb-[env(safe-area-inset-bottom)]" />
    </div>
  );
};

export default Index;
