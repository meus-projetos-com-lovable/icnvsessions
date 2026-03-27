import { useCallback, useRef } from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export function ProgressBar({ currentTime, duration, onSeek }: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleInteraction = useCallback(
    (clientX: number) => {
      const bar = barRef.current;
      if (!bar || duration === 0) return;
      const rect = bar.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      onSeek(x * duration);
    },
    [duration, onSeek]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => handleInteraction(e.clientX),
    [handleInteraction]
  );

  const handleDrag = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.buttons !== 1) return;
      handleInteraction(e.clientX);
    },
    [handleInteraction]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length > 0) {
        handleInteraction(e.touches[0].clientX);
      }
    },
    [handleInteraction]
  );

  return (
    <div
      ref={barRef}
      className="w-full h-10 flex items-center cursor-pointer group touch-none"
      onClick={handleClick}
      onMouseMove={handleDrag}
      onTouchMove={handleTouchMove}
    >
      <div className="w-full h-1 bg-secondary rounded-full relative overflow-hidden transition-[height] duration-150 group-hover:h-2 group-active:h-2">
        <div
          className="absolute inset-y-0 left-0 bg-foreground rounded-full transition-[width] duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
