'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

interface ScratchCircleProps {
  label: string;
  value: string;
  size: number;
  onFullyScratched: () => void;
}

function ScratchCircle({ label, value, size, onFullyScratched }: ScratchCircleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const doneRef = useRef(false);
  const moveCountRef = useRef(0);
  const [isAutoRevealing, setIsAutoRevealing] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const checkPercent = useCallback((canvas: HTMLCanvasElement): number => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return 0;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0, total = 0;
    for (let i = 3; i < data.length; i += 64) { total++; if (data[i] < 128) transparent++; }
    return total > 0 ? transparent / total : 0;
  }, []);

  const revealCurrentCircle = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsAutoRevealing(true);
    // Animate out the remaining scratched layer, then remove it.
    window.setTimeout(() => {
      setIsRevealed(true);
      setIsAutoRevealing(false);
    }, 360);
  }, []);

  const tryCompleteReveal = useCallback((canvas: HTMLCanvasElement) => {
    if (doneRef.current) return;
    const pct = checkPercent(canvas);
    if (pct >= 0.85) {
      doneRef.current = true;
      revealCurrentCircle(canvas);
      onFullyScratched();
    }
  }, [checkPercent, onFullyScratched, revealCurrentCircle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2, r = size / 2;

    const grad = ctx.createRadialGradient(cx * 0.8, cy * 0.75, 0, cx, cy, r);
    grad.addColorStop(0, '#F0D68A');
    grad.addColorStop(0.3, '#D4AF37');
    grad.addColorStop(0.6, '#C4941E');
    grad.addColorStop(0.85, '#B8942E');
    grad.addColorStop(1, '#96700A');
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    const reflGrad = ctx.createLinearGradient(0, 0, size, size);
    reflGrad.addColorStop(0, 'rgba(255,255,255,0)');
    reflGrad.addColorStop(0.35, 'rgba(255,255,255,0.1)');
    reflGrad.addColorStop(0.45, 'rgba(255,250,220,0.25)');
    reflGrad.addColorStop(0.5, 'rgba(255,250,220,0.35)');
    reflGrad.addColorStop(0.55, 'rgba(255,250,220,0.25)');
    reflGrad.addColorStop(0.65, 'rgba(255,255,255,0.1)');
    reflGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = reflGrad;
    ctx.fillRect(0, 0, size, size);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, r - 1.5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(240, 214, 138, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    const edgeGrad = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r);
    edgeGrad.addColorStop(0, 'rgba(0,0,0,0)');
    edgeGrad.addColorStop(1, 'rgba(0,0,0,0.12)');
    ctx.fillStyle = edgeGrad;
    ctx.fillRect(0, 0, size, size);
    ctx.restore();
  }, [size]);

  const getPos = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      if (!e.touches.length) return null;
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const doScratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || doneRef.current) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const brush = 28;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brush * dpr;
    if (lastPosRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x * dpr, lastPosRef.current.y * dpr);
      ctx.lineTo(x * dpr, y * dpr);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x * dpr, y * dpr, (brush / 2) * dpr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    lastPosRef.current = { x, y };

    moveCountRef.current++;
    if (moveCountRef.current % 4 === 0) {
      tryCompleteReveal(canvas);
    }
  }, [tryCompleteReveal]);

  const onStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (doneRef.current) return;
    e.preventDefault(); e.stopPropagation();
    isDrawingRef.current = true; lastPosRef.current = null;
    const p = getPos(e); if (p) doScratch(p.x, p.y);
  }, [getPos, doScratch]);

  const onMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawingRef.current) return;
    e.preventDefault(); e.stopPropagation();
    const p = getPos(e); if (p) doScratch(p.x, p.y);
  }, [getPos, doScratch]);

  const onEnd = useCallback(() => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
    const canvas = canvasRef.current;
    if (canvas) tryCompleteReveal(canvas);
  }, [tryCompleteReveal]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative rounded-full" style={{
        width: size, height: size,
        boxShadow: '0 0 15px rgba(212,175,55,0.4), 0 0 30px rgba(212,175,55,0.2), 0 0 50px rgba(212,175,55,0.1)',
        animation: 'breathe 3s ease-in-out infinite',
      }}>
        <div className="absolute inset-0 flex items-center justify-center rounded-full" style={{
          background: 'linear-gradient(135deg, #FFFAF0, #FFF8EC)',
          border: '3px solid #D4AF37',
        }}>
          <span style={{ fontFamily: 'var(--font-script)', fontSize: size * 0.45, color: '#2C1810' }}>{value}</span>
        </div>
        {!isRevealed && (
          <>
            <canvas
              ref={canvasRef}
              className="absolute inset-0 rounded-full cursor-pointer"
              style={{
                width: size,
                height: size,
                touchAction: 'none',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
                opacity: isAutoRevealing ? 0 : 1,
                transform: isAutoRevealing ? 'scale(1.08)' : 'scale(1)',
                filter: isAutoRevealing ? 'blur(1.5px)' : 'blur(0px)',
                transition: 'opacity 360ms ease, transform 360ms ease, filter 360ms ease',
                pointerEvents: isAutoRevealing ? 'none' : 'auto',
              }}
              onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
              onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd} onTouchCancel={onEnd}
            />
            <div className="absolute inset-0 rounded-full pointer-events-none" style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,250,220,0.15) 40%, rgba(255,250,220,0.3) 50%, rgba(255,250,220,0.15) 60%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 4s linear infinite',
              opacity: isAutoRevealing ? 0 : 1,
              transform: isAutoRevealing ? 'scale(1.08)' : 'scale(1)',
              filter: isAutoRevealing ? 'blur(1.5px)' : 'blur(0px)',
              transition: 'opacity 360ms ease, transform 360ms ease, filter 360ms ease',
            }} />
          </>
        )}
      </div>
      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '10px', color: '#D4AF37', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{label}</p>
    </div>
  );
}

interface ScratchCardProps {
  visible: boolean;
  onComplete: () => void;
}

export default function ScratchCard({ visible, onComplete }: ScratchCardProps) {
  const [showContent, setShowContent] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const doneRef = useRef([false, false, false]);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(t);
  }, [visible]);

  const markDone = useCallback((i: number) => {
    doneRef.current[i] = true;
    if (doneRef.current.every(Boolean) && !completedRef.current) {
      completedRef.current = true;
      setAllDone(true);
      setTimeout(onComplete, 1500);
    }
  }, [onComplete]);

  if (!visible) return null;
  const sz = Math.min(100, (typeof window !== 'undefined' ? window.innerWidth : 390) / 3.8);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center no-scroll" style={{ backgroundColor: '#FFFAF0', zIndex: 45 }}>
      <div className={`text-center mb-10 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h2 className="text-shimmer" style={{ fontFamily: 'var(--font-script)', fontSize: '42px', marginBottom: '8px' }}>Reveal</h2>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '11px', color: '#8B7355', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          scratch to discover our date
        </p>
      </div>
      <div className={`flex items-end justify-center gap-4 transition-all duration-1000 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <ScratchCircle label="Month" value="5" size={sz} onFullyScratched={() => markDone(0)} />
        <div style={{ marginBottom: '34px', color: '#D4AF37', fontFamily: 'var(--font-script)', fontSize: '26px', opacity: 0.5 }}>/</div>
        <ScratchCircle label="Day" value="2" size={sz} onFullyScratched={() => markDone(1)} />
        <div style={{ marginBottom: '34px', color: '#D4AF37', fontFamily: 'var(--font-script)', fontSize: '26px', opacity: 0.5 }}>/</div>
        <ScratchCircle label="Year" value="26" size={sz} onFullyScratched={() => markDone(2)} />
      </div>
      <div className={`absolute bottom-10 left-0 right-0 flex flex-col items-center gap-2 transition-all duration-1000 ${allDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <p className="text-shimmer" style={{ fontFamily: 'var(--font-script)', fontSize: '26px' }}>May 2, 2026</p>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '11px', color: '#8B7355', letterSpacing: '0.15em' }}>save the date</p>
      </div>
    </div>
  );
}
