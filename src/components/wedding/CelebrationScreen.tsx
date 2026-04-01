'use client';

import { useEffect, useCallback, useState, type CSSProperties } from 'react';
import confetti from 'canvas-confetti';

interface CelebrationScreenProps {
  visible: boolean;
  onComplete: () => void;
}

/** Match EventDetails-style pacing (~400ms between major reveals, 800ms motion like FadeSection). */
const ENTER_MS = 800;
const EXIT_MS = 780;
const TOTAL_MS = 6200;

/** Bottom → top: larger gaps so rows don’t read as one burst (EventDetails uses ~400ms active steps). */
const D = {
  tagline: 0,
  names: 420,
  divider: 840,
  date: 1260,
  subtitle: 1680,
  heart: 2100,
  frameOuter: 100,
  frameInner: 220,
  cornerBL: 80,
  cornerBR: 170,
  cornerTL: 1980,
  cornerTR: 2060,
} as const;

function layerStyle(intro: boolean, delayMs: number, exiting: boolean): CSSProperties {
  return {
    opacity: exiting ? 1 : intro ? 1 : 0,
    transform: intro ? 'translateY(0)' : 'translateY(14px)',
    transition: `opacity ${ENTER_MS}ms ease-out, transform ${ENTER_MS}ms ease-out`,
    transitionDelay: exiting ? '0ms' : intro ? `${delayMs}ms` : '0ms',
  };
}

export default function CelebrationScreen({ visible, onComplete }: CelebrationScreenProps) {
  const [intro, setIntro] = useState(false);
  const [exiting, setExiting] = useState(false);

  const fireConfetti = useCallback(() => {
    const colors = ['#7B1818', '#D4AF37', '#B22222', '#FFFAF0', '#C9A94E', '#8B0000', '#F5E6D3'];

    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6, x: 0.5 },
      colors,
      ticks: 120,
      gravity: 0.8,
      scalar: 1,
      shapes: ['circle', 'square'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
        ticks: 150,
        gravity: 1,
        scalar: 0.9,
      });
    }, 250);

    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
        ticks: 150,
        gravity: 1,
        scalar: 0.9,
      });
    }, 500);

    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 160,
        origin: { y: 0.2, x: 0.5 },
        colors,
        ticks: 180,
        gravity: 0.5,
        scalar: 1.1,
        angle: 270,
        startVelocity: 30,
      });
    }, 900);

    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 200,
        origin: { y: 0.4 },
        colors,
        ticks: 200,
        gravity: 0.4,
        scalar: 0.8,
      });
    }, 1400);
  }, []);

  useEffect(() => {
    if (!visible) return;

    fireConfetti();

    const introRaf = requestAnimationFrame(() => setIntro(true));

    const exitTimer = setTimeout(() => setExiting(true), TOTAL_MS - EXIT_MS);
    const completeTimer = setTimeout(() => onComplete(), TOTAL_MS);

    return () => {
      cancelAnimationFrame(introRaf);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [visible, onComplete, fireConfetti]);

  if (!visible) return null;

  const corners: { pos: CSSProperties; delay: number }[] = [
    { pos: { top: '24px', left: '24px' }, delay: D.cornerTL },
    { pos: { top: '24px', right: '24px' }, delay: D.cornerTR },
    { pos: { bottom: '24px', left: '24px' }, delay: D.cornerBL },
    { pos: { bottom: '24px', right: '24px' }, delay: D.cornerBR },
  ];

  return (
    <div
      className="fixed safe-area-screen flex flex-col items-center justify-center"
      style={{
        backgroundColor: '#FFFAF0',
        zIndex: 45,
        overflow: 'hidden',
        opacity: exiting ? 0 : 1,
        transition: `opacity ${EXIT_MS}ms ease-out`,
        pointerEvents: exiting ? 'none' : 'auto',
      }}
    >
      <div
        className="absolute inset-6 border-2 rounded-2xl"
        style={{
          borderColor: 'rgba(212, 175, 55, 0.2)',
          ...layerStyle(intro, D.frameOuter, exiting),
        }}
      />
      <div
        className="absolute inset-10 border rounded-xl"
        style={{
          borderColor: 'rgba(212, 175, 55, 0.1)',
          ...layerStyle(intro, D.frameInner, exiting),
        }}
      />

      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          bottom: '18px',
          width: 'min(135px, 30vw)',
          height: '13px',
          background: '#FFFAF0',
          zIndex: 4,
        }}
      />

      {corners.map(({ pos, delay }, i) => (
        <div key={i} className="absolute" style={{ ...pos, ...layerStyle(intro, delay, exiting) }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 2L8 2L2 8Z" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M2 2L2 8" stroke="#D4AF37" strokeWidth="1" opacity="0.3" />
          </svg>
        </div>
      ))}

      <div className="flex flex-col items-center gap-4 px-12 text-center">
        <div style={layerStyle(intro, D.heart, exiting)}>
          <div className="animate-heartbeat">
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
              <path
                d="M25 45C25 45 5 30 5 17C5 10 10 5 17 5C21 5 24 8 25 10C26 8 29 5 33 5C40 5 45 10 45 17C45 30 25 45 25 45Z"
                fill="#7B1818"
                stroke="#D4AF37"
                strokeWidth="1"
              />
            </svg>
          </div>
        </div>

        <div style={layerStyle(intro, D.subtitle, exiting)}>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '12px',
              color: '#8B7355',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            we&apos;re getting married
          </p>
        </div>

        <div
          className="flex w-full justify-center overflow-visible"
          style={layerStyle(intro, D.date, exiting)}
        >
          <h1
            className="text-shimmer"
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: '52px',
              lineHeight: 1.35,
              display: 'inline-block',
              overflow: 'visible',
              paddingLeft: '0.14em',
              paddingRight: '0.06em',
              paddingTop: '0.04em',
              paddingBottom: '0.08em',
            }}
          >
            2 May 2026
          </h1>
        </div>

        <div
          className="flex items-center gap-3"
          style={layerStyle(intro, D.divider, exiting)}
        >
          <div className="h-px" style={{ width: '50px', background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
          <span style={{ color: '#D4AF37', fontSize: '12px' }}>✦</span>
          <div className="h-px" style={{ width: '50px', background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
        </div>

        <div style={layerStyle(intro, D.names, exiting)}>
          <h2
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: '40px',
              color: '#2C1810',
              lineHeight: 1.4,
              display: 'inline-block',
              overflow: 'visible',
              paddingRight: '0.22em',
              paddingBottom: '0.08em',
            }}
          >
            Ahmad &amp; Salsabeel
          </h2>
        </div>
      </div>

      <div
        className="absolute bottom-10"
        style={layerStyle(intro, D.tagline, exiting)}
      >
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '11px',
            color: '#D4AF37',
            letterSpacing: '0.15em',
          }}
        >
          ✦ with love ✦
        </p>
      </div>
    </div>
  );
}
