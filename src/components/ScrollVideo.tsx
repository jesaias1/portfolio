'use client';

import { useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);

  // useScroll without target tracks the global window scroll
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (!videoRef.current) return;
    
    // Ensure the video is loaded enough to know its duration
    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration);
      }
    };

    videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    // Fallback if already loaded
    if (videoRef.current.readyState >= 1) {
      setDuration(videoRef.current.duration);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, []);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (videoRef.current && duration > 0) {
        // Scrub the video based on scroll progress
        let newTime = latest * duration;
        
        // Prevent it from hitting the exact end which might stop playback or flicker
        if (newTime >= duration) newTime = duration - 0.05;
        if (newTime < 0) newTime = 0;

        // Use requestAnimationFrame for smoother updates
        requestAnimationFrame(() => {
          if (videoRef.current) {
            videoRef.current.currentTime = newTime;
          }
        });
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, duration]);

  return (
    <div className="fixed inset-0 w-full h-screen pointer-events-none -z-[60] overflow-hidden bg-black">
      <video
        ref={videoRef}
        src="/video/bg.mp4"
        className="w-full h-full object-cover opacity-80"
        playsInline
        muted
        preload="auto"
      />
    </div>
  );
}
