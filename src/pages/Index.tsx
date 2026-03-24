import { Music2 } from 'lucide-react';
import { TrackList } from '@/components/TrackList';
import { songs } from '@/config/songs';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center">
              <Music2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground tracking-tight">MultiTrack</h1>
              <p className="text-xs text-muted-foreground">Musical study player</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-foreground mb-1">Songs</h2>
          <p className="text-xs text-muted-foreground">Select a song to open the mixer</p>
        </div>
        <TrackList songs={songs} />
      </main>
    </div>
  );
};

export default Index;
