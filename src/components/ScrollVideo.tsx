'use client';

import { useLenis } from 'lenis/react';
import { useEffect, useRef, useState, useCallback } from 'react';

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);

  // Use Lenis directly instead of Framer Motion's useScroll.
  useLenis((lenis) => {
    if (!videoRef.current || duration === 0) return;
    
    // Calculate scroll progress from 0 to 1
    // Fallback defensively to offsetTop / scrollHeight if lenis.limit is undefined
    const limit = lenis.limit || (document.documentElement.scrollHeight - window.innerHeight);
    const scroll = lenis.scroll || window.scrollY;
    
    if (limit <= 0) return;
    
    const progress = Math.max(0, Math.min(1, scroll / limit));
    let newTime = progress * duration;
    
    // Prevent hitting exact end to avoid flickering
    if (newTime >= duration) newTime = duration - 0.05;
    if (newTime < 0) newTime = 0;

    // Apply exact time to video frame. 
    // Optimization: requestAnimationFrame ensures we only paint when the browser is ready
    requestAnimationFrame(() => {
      if (videoRef.current) {
        // Some browsers (like Safari) require the video to be "played" once to unlock scrubbing
        videoRef.current.currentTime = newTime;
      }
    });
  });

  const handleLoadedMetadata = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const rawDur = e.currentTarget.duration;
    // ensure duration is a valid number, sometimes mobile browsers yield NaN initially
    if (rawDur && !isNaN(rawDur)) {
      setDuration(rawDur);
    }
  }, []);

  useEffect(() => {
    // Touch the video to unlock it on iOS
    const touchVideo = () => {
      if (videoRef.current) {
        // A tiny play/pause unlocks the video for programatic scrubbing on iOS Safari
        videoRef.current.play().then(() => {
          videoRef.current?.pause();
        }).catch(() => {
          // Ignore auto-play block errors
        });
      }
      window.removeEventListener('touchstart', touchVideo);
      window.removeEventListener('click', touchVideo);
    };

    window.addEventListener('touchstart', touchVideo, { once: true });
    window.addEventListener('click', touchVideo, { once: true });
    
    // Fallback if video is somehow already loaded when the component mounts
    if (videoRef.current && videoRef.current.readyState >= 1) {
      const rawDur = videoRef.current.duration;
      if (rawDur && !isNaN(rawDur)) {
        setDuration(rawDur);
      }
    }

    return () => {
      window.removeEventListener('touchstart', touchVideo);
      window.removeEventListener('click', touchVideo);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-screen pointer-events-none -z-[60] overflow-hidden bg-black">
      <video
        ref={videoRef}
        src="/video/bg_1.mp4"
        className="w-full h-full object-cover opacity-80 grayscale contrast-125"
        playsInline
        muted
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
        // Force the browser to render the video layer independently
        style={{ willChange: 'transform' }}
      />
      {/* Soft Vignette Overlay placed globally to maintain contrast perfectly across all sections */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] z-10" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10" />
    </div>
  );
}
