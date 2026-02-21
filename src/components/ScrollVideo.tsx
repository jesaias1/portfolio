'use client';

import { useLenis } from 'lenis/react';
import { useEffect, useRef, useState } from 'react';

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);

  // Use Lenis directly instead of Framer Motion's useScroll.
  // This eliminates the react loop / physics spring delay between Lenis calculating 
  // the scroll position and Framer Motion reading it, which causes jitter.
  useLenis((lenis) => {
    if (!videoRef.current || duration === 0) return;
    
    // calculate scroll progress from 0 to 1 directly from lenis
    const progress = lenis.scroll / lenis.limit;
    
    let newTime = progress * duration;
    
    // Prevent hitting exact end to avoid flickering
    if (newTime >= duration) newTime = duration - 0.05;
    if (newTime < 0) newTime = 0;

    // Apply exact time to video frame synchronously
    videoRef.current.currentTime = newTime;
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
