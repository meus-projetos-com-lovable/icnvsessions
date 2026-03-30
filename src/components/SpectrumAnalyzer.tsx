import { useRef, useEffect, useCallback } from 'react';

interface SpectrumAnalyzerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

const BAR_COUNT = 32;
const BAR_GAP = 2;

export function SpectrumAnalyzer({ analyser, isPlaying }: SpectrumAnalyzerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const dataRef = useRef<Uint8Array | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    if (!dataRef.current) {
      dataRef.current = new Uint8Array(analyser.frequencyBinCount);
    }

    analyser.getByteFrequencyData(dataRef.current);

    ctx.clearRect(0, 0, w, h);

    const barWidth = (w - (BAR_COUNT - 1) * BAR_GAP) / BAR_COUNT;
    const binStep = Math.floor(dataRef.current.length / BAR_COUNT);

    // Get CSS variable for foreground color
    const style = getComputedStyle(canvas);
    const fg = style.getPropertyValue('color').trim();

    for (let i = 0; i < BAR_COUNT; i++) {
      const value = dataRef.current[i * binStep] / 255;
      const barH = Math.max(1, value * h * 0.9);
      const x = i * (barWidth + BAR_GAP);
      const y = h - barH;

      ctx.fillStyle = fg;
      ctx.globalAlpha = 0.25 + value * 0.55;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, 1.5);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    rafRef.current = requestAnimationFrame(draw);
  }, [analyser]);

  useEffect(() => {
    if (isPlaying && analyser) {
      rafRef.current = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(rafRef.current);
      // Clear canvas when stopped
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, analyser, draw]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-10 text-foreground"
      style={{ display: 'block' }}
    />
  );
}
