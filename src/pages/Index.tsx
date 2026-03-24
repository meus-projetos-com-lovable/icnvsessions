import { TrackList } from '@/components/TrackList';
import { songs } from '@/config/songs';
import logo from '@/assets/logo.png';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="ICNV Sessions" className="w-14 h-14 rounded-xl object-cover" />
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight font-display">ICNV Sessions</h1>
              <p className="text-xs text-muted-foreground">Ele move ainda hoje</p>
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
