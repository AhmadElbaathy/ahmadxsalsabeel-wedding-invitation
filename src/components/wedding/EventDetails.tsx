'use client';

import { useEffect, useState } from 'react';

interface EventDetailsProps { visible: boolean; }

function CountdownTimer() {
  const [tl, setTl] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const wedding = new Date('2026-05-02T14:30:00').getTime();
    const tick = () => {
      const diff = wedding - Date.now();
      if (diff > 0) setTl({
        d: Math.floor(diff / 864e5), h: Math.floor((diff % 864e5) / 36e5),
        m: Math.floor((diff % 36e5) / 6e4), s: Math.floor((diff % 6e4) / 1e3),
      });
    };
    tick(); const iv = setInterval(tick, 1000); return () => clearInterval(iv);
  }, []);
  const items = [
    { v: tl.d, l: 'Days' }, { v: tl.h, l: 'Hours' }, { v: tl.m, l: 'Min' }, { v: tl.s, l: 'Sec' },
  ];
  return (
    <div className="flex justify-center gap-3">
      {items.map((u, i) => (
        <div key={u.l} className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, rgba(123,24,24,0.08), rgba(212,175,55,0.12))',
              border: '1px solid rgba(212,175,55,0.2)',
            }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 700, color: '#2C1810' }}>
                {String(u.v).padStart(2, '0')}
              </span>
            </div>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '10px', color: '#8B7355', letterSpacing: '0.1em', marginTop: '4px' }}>{u.l}</span>
          </div>
          {i < 3 && <span style={{ color: '#D4AF37', fontSize: '18px', marginBottom: '14px' }}>:</span>}
        </div>
      ))}
    </div>
  );
}

function FadeSection({ delay, active, children }: { delay: number; active: number; children: React.ReactNode }) {
  return (
    <div className={`mb-5 transition-all duration-800 ${active * 400 > delay ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${delay}ms` }}>{children}</div>
  );
}

export default function EventDetails({ visible }: EventDetailsProps) {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, [visible]);

  useEffect(() => {
    if (!show) return;
    const ts = [400, 800, 1200, 1600, 2000].map(d => setTimeout(() => setActive(p => p + 1), d));
    return () => ts.forEach(clearTimeout);
  }, [show]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 scroll-y no-scroll"
      style={{
        backgroundColor: '#FFFAF0',
        zIndex: 45,
        animation: 'fade-in 0.85s ease-out forwards',
      }}
    >
      <div className="sticky top-0 z-10 pt-4 pb-2 px-6" style={{ background: 'linear-gradient(180deg, #FFFAF0 70%, transparent)' }}>
        <div className="flex items-center justify-center gap-2">
          <div className="h-px flex-1 mx-4" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3))' }} />
          <span style={{ color: '#D4AF37', fontSize: '10px' }}>✦</span>
          <div className="h-px flex-1 mx-4" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.3), transparent)' }} />
        </div>
      </div>

      <div className="px-6 pb-32 max-w-lg mx-auto">
        {/* Header */}
        <FadeSection delay={200} active={active}>
          <div className="text-center mb-6">
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '12px', color: '#8B7355', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Together with their families
            </p>
            <h2 className="text-shimmer" style={{ fontFamily: 'var(--font-script)', fontSize: '44px', lineHeight: 1.2 }}>
              Ahmad &amp; Salsabeel
            </h2>
            <p className="mt-2" style={{ fontFamily: 'var(--font-serif)', fontSize: '13px', color: '#8B7355', fontStyle: 'italic' }}>
              Request the honor of your presence at the celebration of their marriage
            </p>
          </div>
        </FadeSection>

        {/* Date Badge */}
        <FadeSection delay={200} active={active}>
          <div className="flex justify-center mb-8">
            <div className="inline-flex flex-col items-center py-4 px-10 rounded-full" style={{ border: '2px solid rgba(212,175,55,0.3)', background: 'linear-gradient(135deg, rgba(212,175,55,0.05), rgba(212,175,55,0.1))' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '10px', color: '#D4AF37', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Save the Date</span>
              <span style={{ fontFamily: 'var(--font-script)', fontSize: '30px', color: '#2C1810' }}>2 May 2026</span>
            </div>
          </div>
        </FadeSection>

        {/* Countdown */}
        <FadeSection delay={400} active={active}>
          <div className="mb-10 text-center">
            <p className="mb-4" style={{ fontFamily: 'var(--font-serif)', fontSize: '12px', color: '#8B7355', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Counting Down To</p>
            <CountdownTimer />
          </div>
        </FadeSection>

        {/* Divider */}
        <FadeSection delay={600} active={active}>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4))' }} />
            <span style={{ color: '#D4AF37', fontSize: '10px' }}>✦</span>
            <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.4), transparent)' }} />
          </div>
        </FadeSection>

        {/* Ceremony */}
        <FadeSection delay={800} active={active}>
          <div className="rounded-xl p-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(123,24,24,0.03), rgba(212,175,55,0.05))', border: '1px solid rgba(212,175,55,0.15)' }}>
            <div className="absolute top-0 right-0 w-16 h-16 opacity-10" style={{ background: 'radial-gradient(circle at 100% 0%, #D4AF37, transparent 70%)' }} />
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M13 3L16 10L23 11L18 16L19 23L13 20L7 23L8 16L3 11L10 10L13 3Z" stroke="#D4AF37" strokeWidth="1.5" fill="none" /></svg>
              </div>
              <div className="flex-1">
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: '#2C1810', fontWeight: 600, marginBottom: '8px' }}>Wedding Ceremony</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#8B7355" strokeWidth="1" /><path d="M7 4V7L9 9" stroke="#8B7355" strokeWidth="1" strokeLinecap="round" /></svg>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '13px', color: '#8B7355' }}>Time: 2:30 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path
                        d="M1.5 13.15V6.8H3.5Q7 2.05 10.5 6.8H12.5V13.15H1.5Z"
                        stroke="#8B7355"
                        strokeWidth="1"
                        fill="none"
                        strokeLinejoin="round"
                      />
                      <path d="M2.05 8.15h9.9" stroke="#8B7355" strokeWidth="0.85" strokeLinecap="round" />
                      <circle cx="7" cy="4.35" r="0.72" stroke="#8B7355" strokeWidth="0.85" fill="none" />
                      <path
                        d="M2.35 6.48h1.15M10.5 6.48h1.15"
                        stroke="#8B7355"
                        strokeWidth="0.85"
                        strokeLinecap="round"
                      />
                      <path
                        d="M2.3 11.72V9.92Q2.72 9.2 3.14 9.92V11.72"
                        stroke="#8B7355"
                        strokeWidth="0.85"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10.86 11.72V9.92Q11.28 9.2 11.7 9.92V11.72"
                        stroke="#8B7355"
                        strokeWidth="0.85"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d="M5.65 13.15V10.28Q7 8.98 8.35 10.28V13.15"
                        stroke="#8B7355"
                        strokeWidth="0.85"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d="M4.55 10.45Q4.9 9.92 5.25 10.45M8.75 10.45Q9.1 9.92 9.45 10.45"
                        stroke="#8B7355"
                        strokeWidth="0.8"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '13px', color: '#8B7355' }}>Venue: One View</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2C7 2 4 5 4 7.5C4 9.5 5.5 11 7 11C8.5 11 10 9.5 10 7.5C10 5 7 2 7 2Z" stroke="#8B7355" strokeWidth="1" fill="none" /></svg>
                    <a href="https://maps.app.goo.gl/Zqf6cUrgj4oJ5Zs88?g_st=ac" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-serif)', fontSize: '13px', color: '#D4AF37', textDecoration: 'none', borderBottom: '1px solid rgba(212,175,55,0.3)' }}>📍 View on Maps</a>
                  </div>
                </div>
                <p className="mt-2 italic" style={{ fontFamily: 'var(--font-serif)', fontSize: '12px', color: '#B8942E' }}>Join us as we exchange our vows and begin our forever</p>
              </div>
            </div>
          </div>
        </FadeSection>

        {/* Dress Code */}
        <FadeSection delay={1000} active={active}>
          <div className="rounded-xl p-5 text-center" style={{ background: 'linear-gradient(135deg, rgba(123,24,24,0.03), rgba(212,175,55,0.05))', border: '1px solid rgba(212,175,55,0.15)' }}>
            <div className="flex justify-center mb-2">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M13 3C13 3 8 8 8 13C8 18 13 23 13 23C13 23 18 18 18 13C18 8 13 3 13 3Z" stroke="#D4AF37" strokeWidth="1.5" fill="none" /></svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: '#2C1810', fontWeight: 600, marginBottom: '4px' }}>Dress Code</h3>
            <p className="text-shimmer inline-block" style={{ fontFamily: 'var(--font-script)', fontSize: '22px' }}>Formal &amp; Elegant</p>
            <p className="mt-1" style={{ fontFamily: 'var(--font-serif)', fontSize: '12px', color: '#8B7355', fontStyle: 'italic' }}>We kindly request guests dress in formal attire</p>
          </div>
        </FadeSection>

        {/* Closing */}
        <FadeSection delay={1600} active={active}>
          <div className="text-center pt-6 pb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4))' }} />
              <span className="animate-heartbeat" style={{ display: 'inline-block', fontSize: '18px' }}>❤️</span>
              <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.4), transparent)' }} />
            </div>
            <h3 className="text-shimmer" style={{ fontFamily: 'var(--font-script)', fontSize: '32px', marginBottom: '4px' }}>See You There!</h3>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '12px',
                color: '#8B7355',
                letterSpacing: '0.1em',
                display: 'inline-block',
                overflow: 'visible',
                paddingRight: '0.18em',
              }}
            >
              Ahmad &amp; Salsabeel
            </p>
            <p className="mt-1" style={{ fontFamily: 'var(--font-script)', fontSize: '20px', color: '#2C1810' }}>2 May 2026</p>
          </div>
        </FadeSection>
      </div>
    </div>
  );
}
