'use client';

import { useEffect, useRef } from 'react';

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Start playing at a fixed slow rate
    const tryPlay = () => {
      v.playbackRate = 0.85;
      v.play().catch(() => {});
    };

    if (v.readyState >= 3) {
      tryPlay();
    } else {
      v.addEventListener('canplay', tryPlay, { once: true });
    }

    // Throttled scroll-velocity based rate adjustment
    // Only update playback rate every ~100ms to avoid thrashing
    let lastY = window.scrollY;
    let lastUpdate = 0;
    let rafId: number;

    const BASE_RATE = 0.85;
    const MAX_RATE = 1.5;

    const tick = (now: number) => {
      // Only recalculate every 100ms
      if (now - lastUpdate > 100) {
        const dy = Math.abs(window.scrollY - lastY);
        const velocity = dy / Math.max(1, now - lastUpdate);
        const rate = Math.min(MAX_RATE, BASE_RATE + velocity * 0.8);

        // Only update if rate changed significantly (avoid constant property writes)
        if (Math.abs(v.playbackRate - rate) > 0.05) {
          v.playbackRate = rate;
        }

        lastY = window.scrollY;
        lastUpdate = now;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      v.removeEventListener('canplay', tryPlay);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-screen pointer-events-none overflow-hidden bg-black" style={{ zIndex: -60 }}>
      {/* Background video — loops natively */}
      <video
        ref={videoRef}
        src="/video/website%20bg.mp4"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0.85,
        }}
        className="contrast-[1.2] brightness-[0.45]"
        playsInline
        muted
        loop
        preload="auto"
      />

      {/* Heavy vignette overlays to ensure text pops and the aesthetic is dramatic */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] z-10" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/90 z-10" />
    </div>
  );
}
