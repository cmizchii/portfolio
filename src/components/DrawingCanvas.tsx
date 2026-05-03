import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'shaimaa-portfolio-drawing-v1';
const TTL_MS = 5 * 60 * 60 * 1000;

type Stroke = { color: string; points: { x: number; y: number }[] };
type Saved = { strokes: Stroke[]; expires: number; w: number; h: number };

const COLORS = ['#2B2B2B', '#C9735B', '#89CFF0', '#FFB6C1'];

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const drawingRef = useRef(false);
  const currentRef = useRef<Stroke | null>(null);
  const [color, setColor] = useState(COLORS[0]);
  const [showInfo, setShowInfo] = useState(false);

  const drawAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    for (const s of strokesRef.current) {
      if (s.points.length < 1) continue;
      ctx.strokeStyle = s.color;
      ctx.beginPath();
      ctx.moveTo(s.points[0].x, s.points[0].y);
      for (let i = 1; i < s.points.length; i++) {
        ctx.lineTo(s.points[i].x, s.points[i].y);
      }
      ctx.stroke();
    }
  };

  const persist = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data: Saved = {
      strokes: strokesRef.current,
      expires: Date.now() + TTL_MS,
      w: canvas.width,
      h: canvas.height,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore quota */
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext('2d');
      ctx?.scale(dpr, dpr);
      drawAll();
    };

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Saved;
        if (parsed.expires > Date.now()) {
          strokesRef.current = parsed.strokes ?? [];
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      /* ignore parse */
    }

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const getPos = (e: PointerEvent | React.PointerEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    drawingRef.current = true;
    const stroke: Stroke = { color, points: [getPos(e)] };
    currentRef.current = stroke;
    strokesRef.current.push(stroke);
    drawAll();
    canvasRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawingRef.current || !currentRef.current) return;
    currentRef.current.points.push(getPos(e));
    drawAll();
  };

  const onPointerUp = () => {
    drawingRef.current = false;
    currentRef.current = null;
    persist();
  };

  const undo = () => {
    strokesRef.current.pop();
    drawAll();
    persist();
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="draw-canvas active"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
      />
      <div className="absolute bottom-7 left-5 sm:left-8 md:left-10 z-20 flex items-center gap-2 bg-canvas border border-ink/10 rounded-full px-4 py-2 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-[22px] h-[22px] rounded-full transition-transform duration-200 hover:scale-110 ${
              color === c ? 'ring-2 ring-ink/40 scale-110' : ''
            }`}
            style={{ background: c }}
            aria-label={`color ${c}`}
          />
        ))}
        <button
          onClick={undo}
          className="font-body text-[13px] text-muted hover:text-ink px-2 py-1 transition-colors"
        >
          undo
        </button>
        <div
          className="relative flex items-center"
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
        >
          <span className="w-5 h-5 rounded-full border border-ink/20 flex items-center justify-center font-serif italic text-[12px] text-muted hover:text-ink hover:border-ink transition-colors">
            i
          </span>
          {showInfo && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[220px] bg-ink text-white font-body text-[12px] leading-[1.5] p-3 rounded-[10px] z-30">
              sketch something — your drawing stays for 5 hours, even after you leave. the next visitor will see what you drew.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
