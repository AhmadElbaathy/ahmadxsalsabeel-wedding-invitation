'use client';

import { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  delay: number;
  size: number;
}

export default function WelcomeScreen({ onTap }: { onTap: () => void }) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setSparkles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
        size: 3 + Math.random() * 8,
      }))
    );
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer"
      style={{ backgroundColor: '#5A1010' }}
      onClick={onTap}
    >
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(212,175,55,0.3) 0%, transparent 70%)`,
        }}
      />

      {/* Sparkles */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute animate-sparkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${2 + s.delay}s`,
          }}
        >
          <svg
            width={s.size}
            height={s.size}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
              fill="#D4AF37"
            />
          </svg>
        </div>
      ))}

      {/* Content */}
      <div
        className={`relative z-10 flex flex-col items-center gap-6 transition-all duration-1000 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Envelope icon */}
        <div className="relative">
          <div className="animate-breathe rounded-full p-6 border-2 border-[#D4AF37]/30">
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              className="drop-shadow-lg"
            >
              <rect
                x="4"
                y="16"
                width="56"
                height="36"
                rx="3"
                stroke="#D4AF37"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M4 19L32 40L60 19"
                stroke="#D4AF37"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M4 52L22 36"
                stroke="#D4AF37"
                strokeWidth="1.5"
                fill="none"
                opacity="0.5"
              />
              <path
                d="M60 52L42 36"
                stroke="#D4AF37"
                strokeWidth="1.5"
                fill="none"
                opacity="0.5"
              />
            </svg>
          </div>
        </div>

        {/* You're Invited text */}
        <div className="text-center space-y-3">
          <p
            className="text-[#D4AF37] tracking-[0.3em] uppercase"
            style={{ fontSize: '12px', fontFamily: 'var(--font-serif)' }}
          >
            You are cordially invited to
          </p>
          <h1
            className="text-shimmer"
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: '48px',
              lineHeight: 1.2,
            }}
          >
            The Wedding
          </h1>
          <div
            className="h-px mx-auto"
            style={{
              width: '80px',
              background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
            }}
          />
        </div>

        {/* Tap to open */}
        <div className="animate-pulse-gold mt-4">
          <p
            className="text-[#D4AF37]/70 tracking-[0.2em] uppercase"
            style={{ fontSize: '11px', fontFamily: 'var(--font-serif)' }}
          >
            tap to open
          </p>
        </div>
      </div>

      <a
        href="https://wa.me/201501613143?text=Hi%2C%20I%27d%20like%20to%20request%20a%20wedding%20invitation%20design."
        target="_blank"
        rel="noopener noreferrer"
        className="absolute left-1/2 -translate-x-1/2 text-shimmer z-10"
        style={{
          bottom: '12px',
          fontFamily: 'var(--font-serif)',
          fontSize: '10px',
          letterSpacing: '0.08em',
          textDecoration: 'none',
          textShadow: '0 0 6px rgba(212,175,55,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        Tap to request your design
      </a>
    </div>
  );
}
