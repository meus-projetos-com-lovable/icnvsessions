import { useEffect, useRef } from 'react';

export function NoteAnimation({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const W = 220, H = 220, CX = 110, CY = 110;
    let t0: number | null = null;
    const CYCLE = 4500;
    const TAIL = 90;

    // Use CSS variable for color
    const style = getComputedStyle(document.documentElement);
    const fg = style.getPropertyValue('--foreground').trim();
    const strokeColor = fg ? `hsl(${fg})` : 'white';
    const strokeColorAlpha = (a: number) => fg ? `hsl(${fg} / ${a})` : `rgba(255,255,255,${a})`;

    const B = [
      [[110,20],[160,15],[195,50],[200,95],[205,145],[175,185],[130,200],[85,215],[40,190],[25,145],[10,100],[30,45],[70,25],[85,18],[95,21],[110,20]],
      [[110,18],[165,10],[205,55],[205,100],[205,150],[165,195],[115,205],[65,215],[20,180],[15,130],[10,80],[40,35],[80,20],[92,15],[100,20],[110,18]],
      [[110,22],[155,20],[190,60],[195,105],[200,155],[170,188],[120,198],[70,208],[30,182],[20,140],[10,98],[38,50],[75,28],[88,20],[98,23],[110,22]]
    ];

    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
    function eio(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

    function getBorder(t: number) {
      const n = B.length, seg = 1 / n;
      const fi = Math.floor(t / seg) % n, ni = (fi + 1) % n;
      const lt = eio((t % seg) / seg);
      return B[fi].map((p, i) => [lerp(p[0], B[ni][i][0], lt), lerp(p[1], B[ni][i][1], lt)]);
    }

    function borderPath(pts: number[][]) {
      ctx!.beginPath();
      ctx!.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
        ctx!.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
      }
      ctx!.closePath();
    }

    function smooth(pts: number[][], passes: number) {
      let s = [...pts];
      for (let p = 0; p < passes; p++) {
        const n = [s[0]];
        for (let i = 1; i < s.length - 1; i++)
          n.push([(s[i - 1][0] + s[i][0] + s[i + 1][0]) / 3, (s[i - 1][1] + s[i][1] + s[i + 1][1]) / 3]);
        n.push(s[s.length - 1]);
        s = n;
      }
      return s;
    }

    function buildDancePath() {
      const pts: number[][] = [];
      const N = 300;
      for (let i = 0; i <= N; i++) {
        const f = i / N;
        const spin = f * Math.PI * 8;
        const drift = f * Math.PI * 3;
        const r = 28 + Math.sin(f * Math.PI * 2.5) * 18 + Math.sin(f * Math.PI * 5) * 8;
        const ox = Math.sin(drift) * 10;
        const oy = Math.cos(drift * 1.3) * 9;
        const hop = Math.sin(f * Math.PI * 5) * 12;
        pts.push([CX + Math.cos(spin) * r + ox, CY + Math.sin(spin) * r * 0.7 + oy + hop * 0.4]);
      }
      return smooth(pts, 4);
    }

    const OFF_X = -8, OFF_Y = 5;
    const H1 = { cx: 83 + OFF_X, cy: 158 + OFF_Y, rx: 16, ry: 10, ang: -32 * Math.PI / 180 };
    const H2 = { cx: 122 + OFF_X, cy: 148 + OFF_Y, rx: 16, ry: 10, ang: -32 * Math.PI / 180 };
    const S1x = H1.cx + 14, S1bot = H1.cy - 6, S1top = H1.cy - 82;
    const S2x = H2.cx + 14, S2bot = H2.cy - 6, S2top = H2.cy - 82;

    function oval(h: typeof H1, t: number) {
      const a = (t * Math.PI * 2) - Math.PI * 0.1;
      const lx = Math.cos(a) * h.rx * Math.cos(h.ang) - Math.sin(a) * h.ry * Math.sin(h.ang);
      const ly = Math.cos(a) * h.rx * Math.sin(h.ang) + Math.sin(a) * h.ry * Math.cos(h.ang);
      return [h.cx + lx, h.cy + ly];
    }

    function buildNotePath() {
      const pts: number[][] = [];
      const N = 500;
      for (let i = 0; i <= N; i++) {
        const f = i / N;
        let p: number[];
        if (f <= 0.20) p = oval(H1, f / 0.20);
        else if (f <= 0.44) { const ft = (f - 0.20) / 0.24; p = [S1x, lerp(S1bot, S1top, ft)]; }
        else if (f <= 0.56) { const ft = (f - 0.44) / 0.12; p = [lerp(S1x, S2x, ft), lerp(S1top, S2top, ft)]; }
        else if (f <= 0.76) { const ft = (f - 0.56) / 0.20; p = [S2x, lerp(S2top, S2bot, ft)]; }
        else if (f <= 0.96) p = oval(H2, (f - 0.76) / 0.20);
        else {
          const ft = (f - 0.96) / 0.04;
          const last = oval(H2, 1), first = oval(H2, 0);
          p = [lerp(last[0], first[0], ft), lerp(last[1], first[1], ft)];
        }
        pts.push(p);
      }
      return pts;
    }

    const DANCE = buildDancePath();
    const NOTE = buildNotePath();

    function buildFullPath() {
      const full = [...DANCE];
      const from = DANCE[DANCE.length - 1];
      const to = NOTE[0];
      const T = 100;
      for (let i = 1; i <= T; i++) {
        const t = i / T, et = eio(t);
        const mid = [lerp(from[0], to[0], 0.5) + Math.sin(t * Math.PI) * 18, lerp(from[1], to[1], 0.5) + Math.cos(t * Math.PI) * 14];
        const x = lerp(lerp(from[0], mid[0], et), lerp(mid[0], to[0], et), et);
        const y = lerp(lerp(from[1], mid[1], et), lerp(mid[1], to[1], et), et);
        full.push([x, y]);
      }
      for (const p of NOTE) full.push(p);
      return full;
    }

    const FULL = buildFullPath();
    const TOTAL = FULL.length;
    const NOTE_START = DANCE.length + 100;

    function drawCurve(pts: number[][], lw: number, alpha: number) {
      if (!pts || pts.length < 2) return;
      ctx!.save();
      ctx!.strokeStyle = strokeColor;
      ctx!.lineWidth = lw || 2.5;
      ctx!.lineCap = 'round';
      ctx!.lineJoin = 'round';
      ctx!.globalAlpha = alpha || 1;
      ctx!.beginPath();
      ctx!.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
        ctx!.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
      }
      ctx!.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
      ctx!.stroke();
      ctx!.restore();
    }

    function drawTail(tail: number[][]) {
      if (tail.length < 2) return;
      drawCurve(tail, 2.5, 1);
      const h = tail[0];
      ctx!.save();
      const bgColor = style.getPropertyValue('--background').trim();
      const bgHsl = bgColor ? `hsl(${bgColor})` : 'rgba(0,0,0,1)';
      const g = ctx!.createRadialGradient(h[0], h[1], 0, h[0], h[1], 16);
      g.addColorStop(0, bgHsl);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx!.globalCompositeOperation = 'destination-out';
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.arc(h[0], h[1], 16, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    function drawNoteSoFar(headIdx: number) {
      if (headIdx <= NOTE_START) return;
      const slice = FULL.slice(NOTE_START, headIdx + 1);
      drawCurve(slice, 2.5, 1);
    }

    function drawDot(x: number, y: number) {
      ctx!.save();
      ctx!.fillStyle = strokeColor;
      ctx!.beginPath();
      ctx!.arc(x, y, 3, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.globalAlpha = 0.18;
      ctx!.beginPath();
      ctx!.arc(x, y, 6, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    function frame(ts: number) {
      if (!t0) t0 = ts;
      const el = ts - t0;
      const frac = (el % CYCLE) / CYCLE;
      const bT = (el % 9000) / 9000;

      ctx!.clearRect(0, 0, W, H);
      const bpts = getBorder(bT);

      ctx!.save();
      borderPath(bpts);
      ctx!.clip();

      const danceFrac = 0.52;
      let headIdx: number;
      if (frac < danceFrac) {
        headIdx = Math.floor((frac / danceFrac) * (DANCE.length - 1));
      } else {
        const t2 = (frac - danceFrac) / (1 - danceFrac);
        headIdx = DANCE.length + Math.floor(t2 * (TOTAL - DANCE.length - 1));
      }
      headIdx = Math.min(headIdx, TOTAL - 1);

      const tailStart = Math.max(0, headIdx - TAIL);
      const tail = FULL.slice(tailStart, headIdx + 1);

      if (frac >= danceFrac) drawNoteSoFar(headIdx);
      drawTail(tail);
      const head = FULL[headIdx];
      drawDot(head[0], head[1]);

      ctx!.restore();

      ctx!.save();
      borderPath(bpts);
      ctx!.strokeStyle = strokeColor;
      ctx!.lineWidth = 2;
      ctx!.stroke();
      ctx!.restore();

      animRef.current = requestAnimationFrame(frame);
    }

    animRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={220}
      height={220}
      className={className}
    />
  );
}
