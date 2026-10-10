"use client";

import { useEffect, useRef, useState } from "react";

type AutoAdVideoProps = {
  label: string;
  poster?: string;
  src: string | string[];
};

/**
 * Silent looping ad that only downloads and plays while on screen. The optimized screenshot
 * rendered beneath it acts as the poster: the video is mounted on first view and fades in
 * once it is actually playing, so there is never a black frame.
 */
export function AutoAdVideo({ label, src }: AutoAdVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const sources = Array.isArray(src) ? src : [src];
  const activeSrc = sources[activeIndex] ?? sources[0];
  const hasPlaylist = sources.length > 1;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { threshold: 0.25 },
    );
    observer.observe(wrapper);
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
    void video.play().catch(() => {
      // Autoplay can be blocked in background tabs; the next visibility change retries.
    });
  }, [activeSrc, visible, mounted]);

  const handleEnded = () => {
    if (!hasPlaylist) return;
    setPlaying(false);
    setActiveIndex((index) => (index + 1) % sources.length);
  };

  return (
    <div ref={wrapperRef} className="audio-ad-wrap">
      {mounted ? (
        <video
          ref={videoRef}
          src={activeSrc}
          muted
          loop={!hasPlaylist}
          onEnded={handleEnded}
          onPlaying={() => setPlaying(true)}
          playsInline
          preload="auto"
          className="audio-ad-video"
          style={{ opacity: playing ? 1 : 0 }}
          aria-label={label}
        />
      ) : null}
    </div>
  );
}
