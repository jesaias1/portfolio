"use client";

import { useEffect, useRef } from "react";

type AutoAdVideoProps = {
  label: string;
  poster: string;
  src: string;
};

export function AutoAdVideo({ label, poster, src }: AutoAdVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const attemptPlay = () => {
      void video.play().catch(() => {
        // Browsers may pause background tabs; the autoplay attributes remain in place.
      });
    };

    attemptPlay();
    video.addEventListener("canplay", attemptPlay, { once: true });
    return () => video.removeEventListener("canplay", attemptPlay);
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      className="audio-ad-video"
      aria-label={label}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
