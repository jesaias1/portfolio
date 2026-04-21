'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * GlitchFlash — a fixed full-screen overlay that fires a brief cyan scanline
 * flash whenever a section heading scrolls into view.
 * Triggered via a custom DOM event `glitch-flash`.
 */
export default function GlitchFlash() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number>(0);

  const flash = useCallback(() => {
    const el = overlayRef.current;
    if (!el) return;

    // Quick triple flash
    let count = 0;
    const step = () => {
      if (count >= 6) {
        el.style.opacity = '0';
        return;
      }
      el.style.opacity = count % 2 === 0 ? '1' : '0';
      count++;
      timeoutRef.current = window.setTimeout(step, 50);
    };
    step();
  }, []);

  useEffect(() => {
    const handler = () => flash();
    window.addEventListener('glitch-flash', handler);
    return () => {
      window.removeEventListener('glitch-flash', handler);
      clearTimeout(timeoutRef.current);
    };
  }, [flash]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        pointerEvents: 'none',
        opacity: 0,
        background:
          'linear-gradient(transparent 48%, rgba(77,219,255,0.03) 50%, transparent 52%)',
        transition: 'opacity 0.05s',
      }}
    />
  );
}
