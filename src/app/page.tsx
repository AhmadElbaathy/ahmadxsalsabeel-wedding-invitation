'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import WelcomeScreen from '@/components/wedding/WelcomeScreen';
import CurtainAnimation from '@/components/wedding/CurtainAnimation';
import ScratchCard from '@/components/wedding/ScratchCard';
import CelebrationScreen from '@/components/wedding/CelebrationScreen';
import EventDetails from '@/components/wedding/EventDetails';
import FloatingPetals from '@/components/wedding/FloatingPetals';

// 0=Welcome, 1=Curtain, 2=Scratch, 3=Celebration, 4=Details
type Stage = 0 | 1 | 2 | 3 | 4;

export default function Home() {
  const [stage, setStage] = useState<Stage>(0);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [watermarkUnlocked, setWatermarkUnlocked] = useState(false);
  const [celebrationExiting, setCelebrationExiting] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleMusic = useCallback((e?: React.MouseEvent) => {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    const audio = audioRef.current;
    if (!audio) return;
    if (musicPlaying && !musicMuted) {
      audio.muted = true;
      setMusicMuted(true);
    } else {
      audio.muted = false;
      setMusicMuted(false);
    }
  }, [musicPlaying, musicMuted]);

  const startMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const tryPlay = () => {
      audio.currentTime = 0;
      audio.volume = 0;
      const playPromise = audio.play();
      if (playPromise && playPromise.then) {
        playPromise.then(() => {
          setMusicPlaying(true);
          setTimeout(() => { audio.volume = 0.1; }, 200);
          setTimeout(() => { audio.volume = 0.2; }, 600);
          setTimeout(() => { audio.volume = 0.3; }, 1200);
        }).catch(() => {});
      } else {
        setMusicPlaying(true);
        setTimeout(() => { audio.volume = 0.1; }, 200);
        setTimeout(() => { audio.volume = 0.2; }, 600);
        setTimeout(() => { audio.volume = 0.3; }, 1200);
      }
    };
    if (audio.readyState < 2) {
      audio.src = '/bgm.mp3';
      audio.addEventListener('canplaythrough', tryPlay, { once: true });
      audio.load();
    } else {
      tryPlay();
    }
  }, []);

  const handleWelcomeTap = useCallback(() => {
    startMusic();
    setStage(1);
  }, [startMusic]);

  const handleCurtainComplete = useCallback(() => {
    setWatermarkUnlocked(true);
    setTimeout(() => setShowSubtitle(true), 300);
    setTimeout(() => setFadingOut(true), 2000);
    setTimeout(() => {
      setStage(2);
      setShowSubtitle(false);
      setFadingOut(false);
    }, 2800);
  }, []);

  const handleScratchComplete = useCallback(() => { setStage(3); }, []);

  const handleCelebrationComplete = useCallback(() => {
    setCelebrationExiting(true);
    window.setTimeout(() => {
      setStage(4);
      setCelebrationExiting(false);
    }, 850);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && musicPlaying && stage >= 3) audio.volume = 0.4;
  }, [stage, musicPlaying]);

  return (
    <main className="no-scroll" style={{ width: '100vw', height: '100dvh' }}>
      <audio ref={audioRef} src="/bgm.mp3" loop preload="auto" playsInline />
      <FloatingPetals active={stage === 4} />

      {stage > 0 && musicPlaying && (
        <button
          onClick={toggleMusic}
          className="fixed z-[100] w-10 h-10 rounded-full flex items-center justify-center animate-float-music"
          style={{
            bottom: '20px', right: '20px',
            background: musicMuted ? 'rgba(44, 24, 16, 0.5)' : 'linear-gradient(135deg, #D4AF37, #B8942E)',
            boxShadow: musicMuted ? '0 2px 10px rgba(0,0,0,0.2)' : '0 2px 15px rgba(212, 175, 55, 0.4)',
            border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', backdropFilter: 'blur(10px)',
          }}
        >
          {musicMuted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2C1810" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15.54 8.46a5 5 0 010 7.07" strokeLinecap="round" />
              <path d="M19.07 4.93a10 10 0 010 14.14" strokeLinecap="round" />
            </svg>
          )}
        </button>
      )}

      {/* Curtain — only while welcome/curtain stages; unmount after so reset state cannot flash through faded overlays */}
      {stage <= 1 && (
      <CurtainAnimation isOpen={stage === 1} onComplete={handleCurtainComplete}>
        <>
          <div className="flex flex-col items-center gap-2 px-8 overflow-visible">
            <h1
              className="text-center text-shimmer"
              style={{
                fontFamily: 'var(--font-script)',
                fontSize: 'clamp(30px, 10vw, 44px)',
                lineHeight: 1.45,
                display: 'block',
                overflow: 'visible',
                paddingTop: '0.05em',
                paddingBottom: '0.12em',
                paddingLeft: '0.05em',
                paddingRight: '0.22em',
                filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.35))',
              }}
            >
              Ahmad
            </h1>
            <div className="my-2">
              <span className="text-shimmer" style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(22px, 8vw, 30px)' }}>&amp;</span>
            </div>
            <h1
              className="text-center text-shimmer"
              style={{
                fontFamily: 'var(--font-script)',
                fontSize: 'clamp(26px, 8.8vw, 40px)',
                lineHeight: 1.45,
                display: 'block',
                overflow: 'visible',
                paddingTop: '0.05em',
                paddingBottom: '0.10em',
                paddingLeft: '0.05em',
                paddingRight: '0.14em',
                filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.35))',
              }}
            >
              Salsabeel
            </h1>
          </div>
          {!watermarkUnlocked && (
            <a
              href="https://wa.me/201501613143?text=Hi%2C%20I%27d%20like%20to%20request%20a%20wedding%20invitation%20design."
              target="_blank"
              rel="noopener noreferrer"
              className="absolute left-1/2 -translate-x-1/2 text-shimmer"
              style={{
                bottom: '18px',
                fontFamily: 'var(--font-serif)',
                fontSize: '10px',
                letterSpacing: '0.08em',
                textDecoration: 'none',
                filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.35))',
              }}
            >
              Tap to request your design
            </a>
          )}
        </>
      </CurtainAnimation>
      )}

      {/* Welcome — on top, instantly removed on tap */}
      {stage === 0 && <WelcomeScreen onTap={handleWelcomeTap} />}

      {watermarkUnlocked && (
        <a
          href="https://wa.me/201501613143?text=Hi%2C%20I%27d%20like%20to%20request%20a%20wedding%20invitation%20design."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed left-1/2 -translate-x-1/2 z-[101] text-shimmer"
          style={{
            bottom: '18px',
            fontFamily: 'var(--font-serif)',
            fontSize: '10px',
            letterSpacing: '0.08em',
            textDecoration: 'none',
            filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.35))',
          }}
        >
          Tap to request your design
        </a>
      )}

      {/* "we're getting married" + gold line */}
      {stage === 1 && showSubtitle && (
        <div
          className="fixed inset-0 flex flex-col items-center justify-end pb-32 pointer-events-none"
          style={{ zIndex: 52, opacity: fadingOut ? 0 : 1, transition: 'opacity 0.7s ease' }}
        >
          <p className="text-shimmer" style={{
            fontFamily: 'var(--font-serif)', fontSize: '15px',
            letterSpacing: '0.25em', textTransform: 'uppercase',
            animation: 'fade-in-up 0.8s ease-out',
          }}>
            we&apos;re getting married
          </p>
          <div style={{
            width: '0px', marginTop: '14px',
            animation: 'draw-line 0.8s ease-out 0.4s forwards',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #D4AF37, #F0D68A, #D4AF37, transparent)',
            boxShadow: '0 0 8px rgba(212,175,55,0.4), 0 0 16px rgba(212,175,55,0.2)',
          }} />
        </div>
      )}

      {/* Cream overlay to transition to scratch */}
      {stage === 1 && fadingOut && (
        <div className="fixed inset-0" style={{
          zIndex: 53, backgroundColor: '#FFFAF0', animation: 'fade-in 0.7s ease forwards',
        }} />
      )}

      {stage === 2 && <ScratchCard visible onComplete={handleScratchComplete} />}
      {stage === 3 && (
        <div
          style={{
            opacity: celebrationExiting ? 0 : 1,
            transition: 'opacity 0.85s ease',
            pointerEvents: celebrationExiting ? 'none' : 'auto',
          }}
        >
          <CelebrationScreen visible onComplete={handleCelebrationComplete} />
        </div>
      )}
      {stage === 4 && <EventDetails visible />}
    </main>
  );
}
