'use client';

import { useLenis } from 'lenis/react';
import { useEffect, useRef, useState } from 'react';

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  
  // We use a ref to hold the target playhead time to decouple it from React renders
  const targetTimeRef = useRef(0);

  // Use Lenis strictly to update the target time math when scroll happens
  useLenis((lenis) => {
    if (duration > 0) {
      const limit = lenis.limit || Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scroll = lenis.scroll || window.scrollY;
      const progress = Math.max(0, Math.min(1, scroll / limit));
      targetTimeRef.current = progress * duration;
    }
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    if (video.readyState >= 1) handleLoadedMetadata();

    return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
  }, []);

  // Dedicated, continuous high-performance render loop for the video
  useEffect(() => {
    let animationFrameId: number;
    let actualTime = 0;

    const renderLoop = () => {
      if (videoRef.current && duration > 0) {
        // Linear Interpolation: Move 10% of the remaining distance to the target time every frame.
        // This acts as a frictionless physics spring, completely eliminating jitter.
        actualTime += (targetTimeRef.current - actualTime) * 0.1;

        let safeTime = actualTime;
        if (safeTime >= duration) safeTime = duration - 0.05;
        if (safeTime < 0) safeTime = 0;

        // Apply to video frame
        // Checking difference prevents redundant assignment which ruins performance on mobile/Safari
        if (Math.abs(videoRef.current.currentTime - safeTime) > 0.01) {
          videoRef.current.currentTime = safeTime;
        }
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [duration]);

  useEffect(() => {
    // Strict mobile interaction unlock without disrupting the scrub loop
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
        preload="auto"
      />
      {/* Soft Vignette Overlay placed globally to maintain contrast perfectly across all sections */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] z-10" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10" />
    </div>
  );
}
