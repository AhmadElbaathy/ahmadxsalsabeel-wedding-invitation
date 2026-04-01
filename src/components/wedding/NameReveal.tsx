'use client';

import { useEffect, useState } from 'react';

interface NameRevealProps {
  visible: boolean;
  onContinue: () => void;
}

export default function NameReveal({ visible, onContinue }: NameRevealProps) {
  const [stage, setStage] = useState(0);
  const [showSwipe, setShowSwipe] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const timers = [
      setTimeout(() => setStage(1), 400),
      setTimeout(() => setStage(2), 1200),
      setTimeout(() => setStage(3), 2000),
      setTimeout(() => setShowSwipe(true), 3500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed safe-area-screen flex flex-col items-center justify-center cursor-pointer no-scroll"
      style={{
        backgroundColor: '#FFFAF0',
        zIndex: 45,
      }}
      onClick={() => {
        if (showSwipe) onContinue();
      }}
    >
      {/* Top decorative ornament */}
      <div
        className={`absolute top-8 transition-all duration-1000 ${
          stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
      >
        <svg width="60" height="30" viewBox="0 0 60 30" fill="none">
          <path
            d="M30 0C30 0 20 15 0 15C20 15 30 30 30 30C30 30 40 15 60 15C40 15 30 0 30 0Z"
            fill="#D4AF37"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Couple Names */}
      <div className="flex flex-col items-center gap-2 px-8 overflow-visible">
        {/* Ahmad */}
        <div
          className={`overflow-visible transition-all duration-1000 ${
            stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1
            className="text-center"
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(52px, 14vw, 56px)',
              color: '#2C1810',
              lineHeight: 1.45,
              display: 'block',
              overflow: 'visible',
              paddingTop: '0.06em',
              paddingBottom: '0.10em',
              paddingLeft: '0.05em',
              paddingRight: '0.14em',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Ahmad
          </h1>
        </div>

        {/* Decorative ampersand line */}
        <div
          className={`flex items-center gap-4 my-2 transition-all duration-1000 ${
            stage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          <div
            className="h-px"
            style={{
              width: '40px',
              background: 'linear-gradient(90deg, transparent, #D4AF37)',
            }}
          />
          <span
            className="text-shimmer"
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: '36px',
              lineHeight: 1,
            }}
          >
            &amp;
          </span>
          <div
            className="h-px"
            style={{
              width: '40px',
              background: 'linear-gradient(90deg, #D4AF37, transparent)',
            }}
          />
        </div>

        {/* Salsabeel */}
        <div
          className={`overflow-visible transition-all duration-1000 ${
            stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1
            className="text-center"
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(52px, 14vw, 56px)',
              color: '#2C1810',
              lineHeight: 1.45,
              display: 'block',
              overflow: 'visible',
              paddingTop: '0.06em',
              paddingBottom: '0.10em',
              paddingLeft: '0.05em',
              paddingRight: '0.14em',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Salsabeel
          </h1>
        </div>
      </div>

      {/* Date line decoration */}
      <div
        className={`mt-6 transition-all duration-1000 delay-500 ${
          stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z"
              fill="#D4AF37"
              opacity="0.5"
            />
          </svg>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '13px',
              color: '#8B7355',
              letterSpacing: '0.15em',
            }}
          >
            REQUEST THE PLEASURE OF YOUR COMPANY
          </p>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z"
              fill="#D4AF37"
              opacity="0.5"
            />
          </svg>
        </div>
      </div>

      {/* Bottom decorative ornament */}
      <div
        className={`absolute bottom-16 transition-all duration-1000 ${
          stage >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
      >
        <svg width="60" height="30" viewBox="0 0 60 30" fill="none">
          <path
            d="M30 0C30 0 20 15 0 15C20 15 30 30 30 30C30 30 40 15 60 15C40 15 30 0 30 0Z"
            fill="#D4AF37"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Swipe prompt */}
      <div
        className={`absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 transition-all duration-1000 ${
          showSwipe ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="animate-pulse-gold">
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '12px',
              color: '#D4AF37',
              letterSpacing: '0.2em',
            }}
          >
            TAP TO DISCOVER OUR DATE
          </p>
        </div>
        {/* Down arrow */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="animate-bounce"
          style={{ color: '#D4AF37' }}
        >
          <path
            d="M8 2V14M8 14L2 8M8 14L14 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
