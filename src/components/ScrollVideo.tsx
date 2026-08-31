'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
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
    const root = rootRef.current;

    const tick = (now: number) => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));

      if (now - lastUpdate > 100) {
        const distance = Math.abs(window.scrollY - lastY);
        const velocity = distance / Math.max(1, now - lastUpdate);
        const rate = Math.min(maxRate, baseRate + velocity * 0.8);
        if (Math.abs(video.playbackRate - rate) > 0.05) video.playbackRate = rate;

        if (root) {
          const drift = -18 * progress;
          const overlayDrift = drift * 0.35;
          const opacity = Math.max(0.62, 0.85 - progress * 0.16 - Math.min(0.05, velocity * 0.025));
          root.style.setProperty('--bg-parallax-y', `${drift.toFixed(2)}px`);
          root.style.setProperty('--bg-overlay-y', `${overlayDrift.toFixed(2)}px`);
          root.style.setProperty('--bg-video-opacity', opacity.toFixed(3));
        }

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
      ref={rootRef}
      className="pointer-events-none fixed inset-0 h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_50%_28%,#16252b_0%,#080b0c_38%,#030404_76%)]"
      style={{
        zIndex: -60,
        '--bg-parallax-y': '0px',
        '--bg-overlay-y': '0px',
        '--bg-video-opacity': '0.85',
      } as CSSProperties}
      aria-hidden="true"
    >
      {shouldLoadVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-x-0 -top-[3vh] h-[106vh] w-full object-cover contrast-[1.2] brightness-[0.45] will-change-transform"
          style={{
            opacity: 'var(--bg-video-opacity)',
            transform: 'translate3d(0, var(--bg-parallax-y), 0) scale(1.035)',
          }}
          playsInline
          muted
          loop
          preload="metadata"
          poster="/video/website-bg-poster.webp"
          tabIndex={-1}
        >
          <source src="/video/website-bg-optimized.mp4" type="video/mp4" />
        </video>
      ) : null}

      <div className="absolute inset-0 z-10 will-change-transform" style={{ transform: 'translate3d(0, var(--bg-overlay-y), 0)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
      </div>
    </div>
  );
}
