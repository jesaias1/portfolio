'use client';

import { useScroll, useSpring } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);

  // Fallback to Framer Motion useScroll as Lenis limit syncing is unreliable across Next.js layouts
  const { scrollYProgress } = useScroll();
  
  // Spring config tailored to smooth out framer-motion scroll reads
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 40,
    stiffness: 90,
    mass: 0.1,
    restDelta: 0.0001
  });

  useEffect(() => {
    // Subscribe to framer motion's smooth progress
    const unsubscribe = smoothProgress.on('change', (latest) => {
      if (!videoRef.current || duration === 0) return;
      
      let newTime = latest * duration;
      
      // Prevent hitting exact end to avoid flickering
      if (newTime >= duration) newTime = duration - 0.05;
      if (newTime < 0) newTime = 0;

      // Apply exact time to video frame with RAF
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = newTime;
        }
      });
    });

    return () => unsubscribe();
  }, [smoothProgress, duration]);

  const handleLoadedMetadata = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const rawDur = e.currentTarget.duration;
    if (rawDur && !isNaN(rawDur)) {
      setDuration(rawDur);
    }
  }, []);

  useEffect(() => {
    // Mobile unlock hack
    const touchVideo = () => {
      if (videoRef.current) {
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
    
    // Fallback if already loaded
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
        style={{ willChange: 'transform' }}
      />
      {/* Soft Vignette Overlay placed globally to maintain contrast perfectly across all sections */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] z-10" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10" />
    </div>
  );
}
