'use client';

import { useEffect, useCallback, useState } from 'react';
import confetti from 'canvas-confetti';

interface CelebrationScreenProps {
  visible: boolean;
  onComplete: () => void;
}

export default function CelebrationScreen({ visible, onComplete }: CelebrationScreenProps) {
  const [showHeart, setShowHeart] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showNames, setShowNames] = useState(false);

  const fireConfetti = useCallback(() => {
    const colors = ['#7B1818', '#D4AF37', '#B22222', '#FFFAF0', '#C9A94E', '#8B0000', '#F5E6D3'];

    // Initial center burst
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

    // Left side burst
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

    // Right side burst
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

    // Second wave - top
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

    // Third wave - scattered
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

    const timers = [
      setTimeout(() => setShowHeart(true), 300),
      setTimeout(() => setShowText(true), 900),
      setTimeout(() => setShowDate(true), 1500),
      setTimeout(() => setShowNames(true), 2200),
      setTimeout(() => onComplete(), 5000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [visible, onComplete, fireConfetti]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ backgroundColor: '#FFFAF0', zIndex: 45, overflow: 'hidden' }}>

      {/* Decorative frame */}
      <div className="absolute inset-6 border-2 rounded-2xl animate-scale-in"
        style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }} />
      <div className="absolute inset-10 border rounded-xl animate-scale-in delay-200"
        style={{ borderColor: 'rgba(212, 175, 55, 0.1)' }} />

      {/* Corner ornaments */}
      {[
        { top: '24px', left: '24px' },
        { top: '24px', right: '24px' },
        { bottom: '24px', left: '24px' },
        { bottom: '24px', right: '24px' },
      ].map((pos, i) => (
        <div key={i} className="absolute animate-fade-in delay-500" style={pos}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 2L8 2L2 8Z" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M2 2L2 8" stroke="#D4AF37" strokeWidth="1" opacity="0.3" />
          </svg>
        </div>
      ))}

      <div className="flex flex-col items-center gap-4 px-12 text-center">
        {/* Heart animation */}
        <div className={`transition-all duration-700 ${showHeart ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
          style={{ transform: showHeart ? 'scale(1)' : 'scale(0)', transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          <div className="animate-heartbeat">
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
              <path d="M25 45C25 45 5 30 5 17C5 10 10 5 17 5C21 5 24 8 25 10C26 8 29 5 33 5C40 5 45 10 45 17C45 30 25 45 25 45Z"
                fill="#7B1818" stroke="#D4AF37" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* We're Getting Married */}
        <div className={`transition-all duration-1000 ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p style={{
            fontFamily: 'var(--font-serif)', fontSize: '12px', color: '#8B7355',
            letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px',
          }}>
            we&apos;re getting married
          </p>
        </div>

        {/* Date */}
        <div className={`transition-all duration-1000 ${showDate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '0.2s' }}>
          <h1 className="text-shimmer" style={{ fontFamily: 'var(--font-script)', fontSize: '52px', lineHeight: 1.2 }}>
            May 2, 2026
          </h1>
        </div>

        {/* Divider */}
        <div className={`flex items-center gap-3 transition-all duration-1000 ${showDate ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '0.4s' }}>
          <div className="h-px" style={{ width: '50px', background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
          <span style={{ color: '#D4AF37', fontSize: '12px' }}>✦</span>
          <div className="h-px" style={{ width: '50px', background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
        </div>

        {/* Names */}
        <div className={`transition-all duration-1000 ${showNames ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '0.3s' }}>
          <h2 style={{ fontFamily: 'var(--font-script)', fontSize: '40px', color: '#2C1810', lineHeight: 1.3 }}>
            Ahmad &amp; Salsabeel
          </h2>
        </div>
      </div>

      {/* Bottom */}
      <div className={`absolute bottom-10 animate-pulse-gold transition-all duration-1000 ${showNames ? 'opacity-100' : 'opacity-0'}`}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '11px', color: '#D4AF37', letterSpacing: '0.15em' }}>
          ✦ with love ✦
        </p>
      </div>
    </div>
  );
}
