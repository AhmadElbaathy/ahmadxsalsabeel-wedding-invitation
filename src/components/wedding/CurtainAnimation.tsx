'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface CurtainAnimationProps {
  isOpen: boolean;
  onComplete: () => void;
  children: React.ReactNode;
}

export default function CurtainAnimation({ isOpen, onComplete, children }: CurtainAnimationProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const namesRef = useRef<HTMLDivElement>(null);
  const [fading, setFading] = useState(false);
  const hasTriggered = useRef(false);
  const rafRef = useRef(0);
  const readyRef = useRef(false);
  const bgRef = useRef<HTMLDivElement>(null);

  const render = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.paused || video.ended) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = img.data;
    for (let i = 0; i < px.length; i += 4) {
      const l = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
      if (l < 8) {
        px[i + 3] = 0;
      } else if (l < 18) {
        px[i + 3] = ((l - 8) / 10) * 255 | 0;
      }
    }
    ctx.putImageData(img, 0, 0);

    if (!readyRef.current) {
      readyRef.current = true;
      if (bgRef.current) bgRef.current.style.opacity = '0';
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

    const onEnded = () => {
      cancelAnimationFrame(rafRef.current);
      render();
      setFading(true);
      setTimeout(onComplete, 800);
    };
    video.addEventListener('ended', onEnded);

    return () => {
      cancelAnimationFrame(rafRef.current);
      video.removeEventListener('ended', onEnded);
    };
  }, [isOpen, onComplete, render]);

  useEffect(() => {
    if (!isOpen) {
      setFading(false);
      hasTriggered.current = false;
      readyRef.current = false;
      cancelAnimationFrame(rafRef.current);
      if (bgRef.current) bgRef.current.style.opacity = '1';
      if (namesRef.current) namesRef.current.style.opacity = '0';
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isOpen]);

  return (
    <div className="fixed inset-0" style={{ zIndex: 40, overflow: 'visible' }}>
      {/* Layer 1: dark background */}
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{
          zIndex: 1,
          backgroundColor: '#5A1010',
          transition: 'opacity 0.6s ease',
        }}
      />

      {/* Layer 2: names — hidden until first canvas frame */}
      <div
        ref={namesRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          zIndex: 2,
          opacity: 0,
          transition: 'opacity 0.5s ease',
          overflow: 'visible',
        }}
      >
        {children}
      </div>

      {/* Layer 3: canvas curtain */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 3,
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
