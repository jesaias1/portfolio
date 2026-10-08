'use client';

import { useRef, useState, type CSSProperties } from 'react';

type ClickToPlayVideoProps = {
  src: string;
  poster: string;
  label: string;
  buttonLabel?: string;
  accent?: string;
  className?: string;
};

/** Poster-first video that downloads nothing until it is played, then plays with sound. */
export default function ClickToPlayVideo({
  src,
  poster,
  label,
  buttonLabel = 'Play',
  accent = '#4ddbff',
  className = '',
}: ClickToPlayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const start = () => {
    const video = videoRef.current;
    if (!video) return;
    setStarted(true);
    video.muted = false;
    void video.play().catch(() => undefined);
  };

  return (
    <div
      className={`relative aspect-video overflow-hidden bg-black ${className}`}
      style={{ '--accent': accent } as CSSProperties}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls={started}
        playsInline
        preload="none"
        aria-label={label}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {!started ? (
        <button
          type="button"
          onClick={start}
          aria-label={`${buttonLabel}: ${label}`}
          className="group absolute inset-0 z-10 flex items-end justify-start bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 sm:p-6"
        >
          <span className="inline-flex min-h-11 items-center gap-3 border border-white/30 bg-black/55 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white backdrop-blur-md transition duration-300 group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] group-focus-visible:border-[var(--accent)]">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            {buttonLabel}
          </span>
        </button>
      ) : null}
    </div>
  );
}
