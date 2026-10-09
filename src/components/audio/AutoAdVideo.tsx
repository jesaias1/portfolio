"use client";

import { useEffect, useRef, useState } from "react";

type AutoAdVideoProps = {
  label: string;
  poster?: string;
  src: string | string[];
};

/** Silent looping ad that only downloads and plays while it is on screen. */
// The optimized screenshot rendered beneath the video acts as the poster, so none is set here.
export function AutoAdVideo({ label, src }: AutoAdVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const sources = Array.isArray(src) ? src : [src];
  const activeSrc = sources[activeIndex] ?? sources[0];
  const hasPlaylist = sources.length > 1;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.25,
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    if (!visible) {
      video.pause();
      return;
    }

    const attemptPlay = () => {
      void video.play().catch(() => {
        // Browsers may block autoplay in background tabs; the next visibility change retries.
      });
    };
    attemptPlay();
    video.addEventListener("canplay", attemptPlay, { once: true });
    return () => video.removeEventListener("canplay", attemptPlay);
  }, [activeSrc, visible]);

  const handleEnded = () => {
    if (!hasPlaylist) return;
    setActiveIndex((index) => (index + 1) % sources.length);
  };

  return (
    <video
      ref={videoRef}
      src={activeSrc}
      muted
      loop={!hasPlaylist}
      onEnded={handleEnded}
      playsInline
      preload="none"
      className="audio-ad-video"
      aria-label={label}
    />
  );
}
