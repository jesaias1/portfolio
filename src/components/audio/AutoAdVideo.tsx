"use client";

import { useEffect, useRef } from "react";
import { useState } from "react";

type AutoAdVideoProps = {
  label: string;
  poster: string;
  src: string | string[];
};

export function AutoAdVideo({ label, poster, src }: AutoAdVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const sources = Array.isArray(src) ? src : [src];
  const activeSrc = sources[activeIndex] ?? sources[0];
  const hasPlaylist = sources.length > 1;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const attemptPlay = () => {
      void video.play().catch(() => {
        // Browsers may pause background tabs; the autoplay attributes remain in place.
      });
    };

    video.load();
    attemptPlay();
    video.addEventListener("canplay", attemptPlay, { once: true });
    return () => video.removeEventListener("canplay", attemptPlay);
  }, [activeSrc]);

  const handleEnded = () => {
    if (!hasPlaylist) return;
    setActiveIndex((index) => (index + 1) % sources.length);
  };

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop={!hasPlaylist}
      onEnded={handleEnded}
      playsInline
      preload="metadata"
      poster={poster}
      className="audio-ad-video"
      aria-label={label}
    >
      <source src={activeSrc} type="video/mp4" />
    </video>
  );
}
