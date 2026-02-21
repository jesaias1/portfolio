'use client';

import { useLenis } from 'lenis/react';
import { useEffect, useRef, useState, useCallback } from 'react';

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Directly hook into Lenis for zero-latency frame syncing
  useLenis((lenis) => {
    if (!videoRef.current || duration === 0 || !isReady) return;
    
    // Calculate progress with defensive fallbacks
    const limit = lenis.limit || (document.documentElement.scrollHeight - window.innerHeight);
    const scroll = lenis.scroll || window.scrollY;
    
    if (limit <= 0) return;
    
    const progress = Math.max(0, Math.min(1, scroll / limit));
    let newTime = progress * duration;
    
    if (newTime >= duration) newTime = duration - 0.05;
    if (newTime < 0) newTime = 0;

    // Use requestAnimationFrame to sync with the browser's paint cycle
    requestAnimationFrame(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = newTime;
      }
    });
  });

  const handleLoadedMetadata = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const rawDur = e.currentTarget.duration;
    if (rawDur && !isNaN(rawDur)) {
      setDuration(rawDur);
    }
  }, []);

  const handleCanPlayThrough = useCallback(() => {
    if (videoRef.current) {
      // Pause the video as soon as it's ready so it doesn't just play normally.
      // This allows 'autoPlay' to initialize the buffer, but stops it from advancing
      // automatically, handing control over to Lenis.
      videoRef.current.pause();
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    // Touch unlock for strict mobile browsers
    const touchVideo = () => {
      if (videoRef.current) {
        videoRef.current.play().then(() => {
          videoRef.current?.pause();
          setIsReady(true);
        }).catch(() => {});
      }
      window.removeEventListener('touchstart', touchVideo);
      window.removeEventListener('click', touchVideo);
    };

    window.addEventListener('touchstart', touchVideo, { once: true });
    window.addEventListener('click', touchVideo, { once: true });
    
    // Fallback if video is somehow completely loaded instantly
    if (videoRef.current && videoRef.current.readyState >= 3) {
      const rawDur = videoRef.current.duration;
      if (rawDur && !isNaN(rawDur)) {
        setDuration(rawDur);
      }
      videoRef.current.pause();
      setIsReady(true);
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
        style={{ width: '100%', height: '100%', objectFit: 'cover', willChange: 'transform' }}
        className="opacity-80 grayscale contrast-125"
        playsInline
        muted
        autoPlay // Forces the browser to prime the playhead and load the first frame
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlayThrough={handleCanPlayThrough}
      />
      {/* Soft Vignette Overlay placed globally to maintain contrast perfectly across all sections */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] z-10" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10" />
    </div>
  );
}
