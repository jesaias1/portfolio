'use client';

import { useEffect, useRef } from 'react';

export default function ScrollVideo() {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2) return;

    // Start playing slowly as soon as media is ready
    const tryPlay = () => {
      v1.playbackRate = 0.35;
      v1.play().catch(() => {});
    };

    if (v1.readyState >= 3) {
      tryPlay();
    } else {
      v1.addEventListener('canplay', tryPlay, { once: true });
    }

    // Slightly speed up / slow down based on scroll velocity for a subtle
    // "driven by scrolling" feel — without ever seeking (which causes frame skips).
    let lastY = window.scrollY;
    let lastT = performance.now();
    let rafId: number;

    const BASE_RATE = 0.35;
    const MAX_RATE = 1.2;
    const FADE_DURATION = 1.0; // 1 second crossfade overlap

    const tick = (now: number) => {
      const dy = window.scrollY - lastY;
      const dt = Math.max(1, now - lastT); // ms
      const velocity = Math.abs(dy) / dt; // px/ms

      // Map velocity → playback rate
      const boosted = BASE_RATE + velocity * 0.8;
      const rate = Math.min(MAX_RATE, boosted);
      
      v1.playbackRate = rate;
      v2.playbackRate = rate;

      // Make sure we have a valid duration before crossfading
      const duration = v1.duration || 0;

      if (duration > 0) {
        // Start v2 if v1 is nearing the end
        if (v1.currentTime >= duration - FADE_DURATION && v2.paused && v1.currentTime < duration - 0.1) {
            v2.currentTime = 0;
            v2.play().catch(() => {});
        }
        // Start v1 if v2 is nearing the end
        if (v2.currentTime >= duration - FADE_DURATION && v1.paused && v2.currentTime < duration - 0.1) {
            v1.currentTime = 0;
            v1.play().catch(() => {});
        }

        // Pause the video that has finished fading out
        if (v1.currentTime >= duration - 0.1 && !v1.paused) {
            v1.pause();
        }
        if (v2.currentTime >= duration - 0.1 && !v2.paused) {
            v2.pause();
        }

        // Calculate crossfade opacities
        let o1 = v1.paused ? 0 : 1;
        let o2 = v2.paused ? 0 : 1;

        if (!v1.paused && !v2.paused) {
            if (v1.currentTime >= duration - FADE_DURATION) {
                // v1 is fading out, v2 is fading in
                o1 = Math.max(0, (duration - v1.currentTime) / FADE_DURATION);
                o2 = 1 - o1;
            } else if (v2.currentTime >= duration - FADE_DURATION) {
                // v2 is fading out, v1 is fading in
                o2 = Math.max(0, (duration - v2.currentTime) / FADE_DURATION);
                o1 = 1 - o2;
            }
        }

        // Apply clamped opacities (multiplied by 0.85 to maintain original styling)
        v1.style.opacity = (Math.max(0, Math.min(1, o1)) * 0.85).toString();
        v2.style.opacity = (Math.max(0, Math.min(1, o2)) * 0.85).toString();
      }

      lastY = window.scrollY;
      lastT = now;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      v1.removeEventListener('canplay', tryPlay);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-screen pointer-events-none -z-[60] overflow-hidden bg-black">
      {/* Video 1 */}
      <video
        ref={video1Ref}
        src="/video/bg_1.mp4"
        style={{ width: '100%', height: '100%', objectFit: 'cover', willChange: 'transform', position: 'absolute', top: 0, left: 0 }}
        className="grayscale contrast-[1.4] brightness-[0.4]"
        playsInline
        muted
        preload="auto"
      />
      {/* Video 2 (used for crossfade) */}
      <video
        ref={video2Ref}
        src="/video/bg_1.mp4"
        style={{ width: '100%', height: '100%', objectFit: 'cover', willChange: 'transform', position: 'absolute', top: 0, left: 0, opacity: 0 }}
        className="grayscale contrast-[1.4] brightness-[0.4]"
        playsInline
        muted
        preload="auto"
      />
      
      {/* Heavy vignette overlays to ensure text pops and the aesthetic is dramatic */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] z-10" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/90 z-10" />
    </div>
  );
}
