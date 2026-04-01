'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/** Fire music-button gold this many seconds before the curtain clip ends (shorter wait than full end). */
const EARLY_GOLD_BEFORE_END_SEC = 1.25;

const CREAM_R = 255;
const CREAM_G = 250;
const CREAM_B = 240;

/** Uniform black bars (letterbox) vs dark curtain fabric: bars have ~flat luminance across the row/col. */
function detectVideoContentBounds(px: Uint8ClampedArray, w: number, h: number) {
  const lum = (i: number) => 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];

  const rowUniformBlack = (y: number) => {
    let minL = 255;
    let maxL = 0;
    let sum = 0;
    for (let x = 0; x < w; x++) {
      const l = lum((y * w + x) * 4);
      sum += l;
      if (l < minL) minL = l;
      if (l > maxL) maxL = l;
    }
    const mean = sum / w;
    return mean < 12 && maxL - minL < 28;
  };

  let minY = 0;
  while (minY < h && rowUniformBlack(minY)) minY++;
  let maxY = h - 1;
  while (maxY > minY && rowUniformBlack(maxY)) maxY--;
  if (minY >= maxY) return null;

  const colUniformBlack = (x: number, y0: number, y1: number) => {
    let minL = 255;
    let maxL = 0;
    let sum = 0;
    const span = y1 - y0 + 1;
    for (let y = y0; y <= y1; y++) {
      const l = lum((y * w + x) * 4);
      sum += l;
      if (l < minL) minL = l;
      if (l > maxL) maxL = l;
    }
    const mean = sum / span;
    return mean < 12 && maxL - minL < 28;
  };

  let minX = 0;
  while (minX < w && colUniformBlack(minX, minY, maxY)) minX++;
  let maxX = w - 1;
  while (maxX > minX && colUniformBlack(maxX, minY, maxY)) maxX--;

  if (minX >= maxX || minY >= maxY) return null;
  return { minX, minY, maxX, maxY };
}

interface CurtainAnimationProps {
  isOpen: boolean;
  onComplete: () => void;
  /** Fires when the curtain begins fading out (video ended) — e.g. switch UI that no longer sits under the fabric. */
  onFadingStart?: () => void;
  children: React.ReactNode;
}

export default function CurtainAnimation({ isOpen, onComplete, onFadingStart, children }: CurtainAnimationProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const namesRef = useRef<HTMLDivElement>(null);
  const [fading, setFading] = useState(false);
  const hasTriggered = useRef(false);
  const goldUiNotifiedRef = useRef(false);
  const rafRef = useRef(0);
  const readyRef = useRef(false);
  /** Theater red until first frame — hidden with display:none synchronously (setState would lag one frame and keyed edges still picked up red) */
  const bgRedRef = useRef<HTMLDivElement>(null);
  /** Video letterbox (black bars) — if chroma-keyed like stage blacks, bg showed through in bands not behind fabric */
  const contentBoundsRef = useRef<{ minX: number; minY: number; maxX: number; maxY: number } | null>(null);

  const render = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.paused || video.ended) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.drawImage(video, 0, 0, w, h);

    const img = ctx.getImageData(0, 0, w, h);
    const px = img.data;

    if (!contentBoundsRef.current) {
      contentBoundsRef.current = detectVideoContentBounds(px, w, h);
    }
    const b = contentBoundsRef.current;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const l = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];

        const inContent =
          !b || (x >= b.minX && x <= b.maxX && y >= b.minY && y <= b.maxY);

        // Letterbox / pillarbox: keep opaque cream — do not key to transparent (would reveal bg / wrong red bands)
        if (!inContent && l < 22) {
          px[i] = CREAM_R;
          px[i + 1] = CREAM_G;
          px[i + 2] = CREAM_B;
          px[i + 3] = 255;
          continue;
        }

        if (l < 8) {
          px[i + 3] = 0;
        } else if (l < 18) {
          px[i + 3] = ((l - 8) / 10) * 255 | 0;
        }
      }
    }
    ctx.putImageData(img, 0, 0);

    if (!readyRef.current) {
      readyRef.current = true;
      const red = bgRedRef.current;
      if (red) red.style.display = 'none';
      if (namesRef.current) namesRef.current.style.opacity = '1';
    }

    rafRef.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    if (!isOpen || hasTriggered.current) return;
    hasTriggered.current = true;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = 704;
    canvas.height = 1264;

    video.currentTime = 0;
    video.play().then(() => {
      rafRef.current = requestAnimationFrame(render);
    }).catch(() => {});

    const notifyGoldOnce = () => {
      if (goldUiNotifiedRef.current) return;
      goldUiNotifiedRef.current = true;
      onFadingStart?.();
    };

    const onTimeUpdate = () => {
      const v = videoRef.current;
      if (!v || goldUiNotifiedRef.current) return;
      const d = v.duration;
      if (!Number.isFinite(d) || d <= 0) return;
      if (d - v.currentTime <= EARLY_GOLD_BEFORE_END_SEC) {
        notifyGoldOnce();
      }
    };

    const onEnded = () => {
      cancelAnimationFrame(rafRef.current);
      render();
      setFading(true);
      notifyGoldOnce();
      setTimeout(onComplete, 800);
    };
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);

    return () => {
      cancelAnimationFrame(rafRef.current);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
    };
  }, [isOpen, onComplete, onFadingStart, render]);

  useEffect(() => {
    if (!isOpen) {
      setFading(false);
      hasTriggered.current = false;
      goldUiNotifiedRef.current = false;
      readyRef.current = false;
      contentBoundsRef.current = null;
      cancelAnimationFrame(rafRef.current);
      if (bgRedRef.current) bgRedRef.current.style.display = '';
      if (namesRef.current) namesRef.current.style.opacity = '0';
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isOpen]);

  return (
    <div className="fixed safe-area-screen" style={{ zIndex: 40, overflow: 'visible' }}>
      {/* Layer 1: invitation cream — always under stack; stops red bleed through semi-transparent / edge keyed pixels */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          backgroundColor: '#FFFAF0',
        }}
      />
      {/* Layer 2: theater red until first painted frame — hidden via ref synchronously on first frame */}
      <div
        ref={bgRedRef}
        className="absolute inset-0"
        style={{
          zIndex: 2,
          backgroundColor: '#5A1010',
        }}
      />

      {/* Layer 3: names — hidden until first canvas frame */}
      <div
        ref={namesRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          zIndex: 3,
          opacity: 0,
          transition: 'opacity 0.5s ease',
          overflow: 'visible',
        }}
      >
        {children}
      </div>

      {/* Layer 4: canvas curtain */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 4,
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.8s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Hidden video */}
      <video ref={videoRef} src="/curtain-animation.mp4" muted playsInline preload="auto" style={{ display: 'none' }} />
    </div>
  );
}
