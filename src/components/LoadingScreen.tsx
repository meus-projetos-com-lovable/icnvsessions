import { useState, useEffect } from 'react';
import { NoteAnimation } from './NoteAnimation';

interface LoadingScreenProps {
  onFinished: () => void;
}

export function LoadingScreen({ onFinished }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);

  const phrases = [
    'Preparando instrumentos…',
    'Afinando canais…',
    'Carregando sessões…',
    'Quase pronto…',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(100, p + Math.random() * 8 + 2);
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 30) setPhase(0);
    else if (progress < 60) setPhase(1);
    else if (progress < 85) setPhase(2);
    else setPhase(3);
  }, [progress]);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(onFinished, 600);
      return () => clearTimeout(timer);
    }
  }, [progress, onFinished]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        progress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Animated note */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl scale-150 animate-pulse" />
        <NoteAnimation />
      </div>

      {/* Brand */}
      <h1 className="text-2xl font-bold text-foreground tracking-tight font-display mb-1">
        ICNV Sessions
      </h1>
      <p className="text-sm text-muted-foreground mb-8 transition-all duration-300">
        {phrases[phase]}
      </p>

      {/* Progress bar */}
      <div className="w-56 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-foreground rounded-full transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Percentage */}
      <span className="mt-3 text-xs text-muted-foreground font-mono tabular-nums">
        {Math.round(progress)}%
      </span>
    </div>
  );
}
