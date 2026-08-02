'use client';

import { useEffect, useRef, useState } from 'react';

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 769px)');
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true;
    const update = () => setShouldLoadVideo(desktop.matches && !reducedMotion.matches && !saveData);

    update();
    desktop.addEventListener('change', update);
    reducedMotion.addEventListener('change', update);

    return () => {
      desktop.removeEventListener('change', update);
      reducedMotion.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;

    const tryPlay = () => {
      video.playbackRate = 0.85;
      void video.play().catch(() => undefined);
    };

    if (video.readyState >= 3) tryPlay();
    else video.addEventListener('canplay', tryPlay, { once: true });

    let lastY = window.scrollY;
    let lastUpdate = 0;
    let rafId = 0;
    const baseRate = 0.85;
    const maxRate = 1.5;

    const tick = (now: number) => {
      if (now - lastUpdate > 100) {
        const distance = Math.abs(window.scrollY - lastY);
        const velocity = distance / Math.max(1, now - lastUpdate);
        const rate = Math.min(maxRate, baseRate + velocity * 0.8);
        if (Math.abs(video.playbackRate - rate) > 0.05) video.playbackRate = rate;
        lastY = window.scrollY;
        lastUpdate = now;
      }
      rafId = window.requestAnimationFrame(tick);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(rafId);
        video.pause();
      } else {
        tryPlay();
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.cancelAnimationFrame(rafId);
      video.removeEventListener('canplay', tryPlay);
      document.removeEventListener('visibilitychange', handleVisibility);
      video.pause();
    };
  }, [shouldLoadVideo]);

  return (
    <div
      className="pointer-events-none fixed inset-0 h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_50%_28%,#16252b_0%,#080b0c_38%,#030404_76%)]"
      style={{ zIndex: -60 }}
      aria-hidden="true"
    >
      {shouldLoadVideo ? (
        <video
          ref={videoRef}
          src="/video/website%20bg.mp4"
          className="absolute inset-0 h-full w-full object-cover opacity-85 contrast-[1.2] brightness-[0.45]"
          playsInline
          muted
          loop
          preload="metadata"
          tabIndex={-1}
        />
      ) : null}

      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
    </div>
  );
}
