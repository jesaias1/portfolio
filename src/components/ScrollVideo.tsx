'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);

  const handleLoadedMetadata = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const rawDur = e.currentTarget.duration;
    if (rawDur && !isNaN(rawDur)) {
      setDuration(rawDur);
    }
  }, []);

  // 1. Pure, native scroll event listener.
  // We attach this directly to the window so we don't rely on Framer Motion's useScroll
  // or Lenis's useLenis hooks, which seem to be dropping the timeline connection on Vercel.
  useEffect(() => {
    if (duration <= 0) return;

    // Use a tiny physics buffer for smoothness
    let currentScrollTime = 0;
    let targetScrollTime = 0;
    let animationFrameId: number;

    const handleScroll = () => {
      // Calculate max scroll depth
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      
      // Calculate fraction
      const fraction = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      
      // Set the target playhead time
      targetScrollTime = fraction * duration;
    };

    const renderLoop = () => {
      if (videoRef.current) {
        // Linear interpolation for silky smoothness
        currentScrollTime += (targetScrollTime - currentScrollTime) * 0.08;
        
        // Safety bounds
        let safeTime = currentScrollTime;
        if (safeTime >= duration) safeTime = duration - 0.05;
        if (safeTime < 0) safeTime = 0;

        // Apply if difference is meaningful
        if (Math.abs(videoRef.current.currentTime - safeTime) > 0.01) {
          videoRef.current.currentTime = safeTime;
        }
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    // Start listening
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Kick off one layout calculation immediately to handle initial load position
    handleScroll();
    
    // Start continuous render loop
    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [duration]);

  useEffect(() => {
    // Touch unlock for mobile browsers
    const touchVideo = () => {
      if (videoRef.current) {
        const p = videoRef.current.play();
        if (p !== undefined) {
            p.then(() => {
                videoRef.current?.pause();
            }).catch(() => {});
        }
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
      {/* Video element - significantly darkened via CSS filters */}
      <video
        ref={videoRef}
        src="/video/bg_1.mp4"
        style={{ width: '100%', height: '100%', objectFit: 'cover', willChange: 'transform' }}
        className="opacity-[0.85] grayscale contrast-[1.4] brightness-[0.4]"
        playsInline
        muted
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
      />
      {/* Heavy vignette overlays to ensure text pops and the aesthetic is dramatic */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] z-10" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/90 z-10" />
    </div>
  );
}
