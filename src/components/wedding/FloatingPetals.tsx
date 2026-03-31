'use client';

import { useMemo } from 'react';

interface Petal {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  color: string;
}

export default function FloatingPetals({ active = false }: { active?: boolean }) {
  const petals = useMemo(() => {
    if (!active) return [];

    const colors = [
      'rgba(123, 24, 24, 0.15)',
      'rgba(178, 34, 34, 0.12)',
      'rgba(212, 175, 55, 0.1)',
      'rgba(139, 0, 0, 0.1)',
      'rgba(200, 160, 80, 0.08)',
    ];

    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 12,
      size: 8 + Math.random() * 16,
      opacity: 0.3 + Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    })) as Petal[];
  }, [active]);

  if (!active || petals.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-float-petal"
          style={{
            left: `${petal.left}%`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
            opacity: petal.opacity,
          }}
        >
          <div
            style={{
              width: petal.size,
              height: petal.size * 0.6,
              backgroundColor: petal.color,
              borderRadius: '50% 0 50% 50%',
              transform: 'rotate(45deg)',
            }}
          />
        </div>
      ))}
    </div>
  );
}
