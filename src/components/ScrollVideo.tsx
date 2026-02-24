'use client';

import { useEffect, useRef } from 'react';

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start playing slowly as soon as media is ready
    const tryPlay = () => {
      video.playbackRate = 0.35;
      video.play().catch(() => {});
    };

    if (video.readyState >= 3) {
      tryPlay();
    } else {
      video.addEventListener('canplay', tryPlay, { once: true });
    }

    // Slightly speed up / slow down based on scroll velocity for a subtle
    // "driven by scrolling" feel — without ever seeking (which causes frame skips).
    let lastY = window.scrollY;
    let lastT = performance.now();
    let rafId: number;

    const BASE_RATE = 0.35;
    const MAX_RATE = 1.2;

    const tick = (now: number) => {
      const dy = window.scrollY - lastY;
      const dt = Math.max(1, now - lastT); // ms
      const velocity = Math.abs(dy) / dt; // px/ms

      // Map velocity → playback rate
      const boosted = BASE_RATE + velocity * 0.8;
      video.playbackRate = Math.min(MAX_RATE, boosted);

      lastY = window.scrollY;
      lastT = now;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener('canplay', tryPlay);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-screen pointer-events-none -z-[60] overflow-hidden bg-black">
      {/* Video element - significantly darkened via CSS filters */}
      <video
        ref={videoRef}
        src="/video/bg_1.mp4"
        style={{ width: '100%', height: '100%', objectFit: 'cover', willChange: 'transform' }}
        className="opacity-[0.85] grayscale contrast-[1.4] brightness-[0.4]"
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
