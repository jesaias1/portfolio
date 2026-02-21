'use client';

import { useScroll, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);

  const { scrollYProgress } = useScroll();
  
  // Add physics-based smoothing for buttery video scrubbing
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 100,
    mass: 0.5
  });

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setDuration(e.currentTarget.duration);
  };

  useEffect(() => {
    // Fallback if video is somehow already loaded when the component mounts
    if (videoRef.current && videoRef.current.readyState >= 1) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  useEffect(() => {
    // Subscribe to the smoothed progress
    const unsubscribe = smoothProgress.on('change', (latest) => {
      if (videoRef.current && duration > 0) {
        // Calculate proportional time
        let newTime = latest * duration;
        
        // Prevent it from hitting the exact end which might cause flickering
        if (newTime >= duration) newTime = duration - 0.05;
        if (newTime < 0) newTime = 0;

        // Apply time via RAF to avoid choking the main thread
        requestAnimationFrame(() => {
          if (videoRef.current) {
            videoRef.current.currentTime = newTime;
          }
        });
      }
    });

    return () => unsubscribe();
  }, [smoothProgress, duration]);

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
      />
      {/* Soft Vignette Overlay placed globally to maintain contrast perfectly across all sections */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] z-10" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10" />
    </div>
  );
}
