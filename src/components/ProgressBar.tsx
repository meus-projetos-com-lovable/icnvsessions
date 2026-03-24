import { useCallback, useRef } from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export function ProgressBar({ currentTime, duration, onSeek }: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const bar = barRef.current;
      if (!bar || duration === 0) return;
      const rect = bar.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      onSeek(x * duration);
    },
    [duration, onSeek]
  );

  const handleDrag = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.buttons !== 1) return;
      handleClick(e);
    },
    [handleClick]
  );

  return (
    <div
      ref={barRef}
      className="w-full h-8 flex items-center cursor-pointer group"
      onClick={handleClick}
      onMouseMove={handleDrag}
    >
      <div className="w-full h-1.5 bg-secondary rounded-full relative overflow-hidden transition-[height] duration-150 group-hover:h-2.5">
        <div
          className="absolute inset-y-0 left-0 bg-foreground rounded-full transition-[width] duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
