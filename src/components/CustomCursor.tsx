'use client';

import { useEffect, useRef, useCallback } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  }, []);

  useEffect(() => {
    // Only show on desktop (fine pointer)
    if (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Track hover state for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, select, label[for]')) {
        ringRef.current?.classList.add('cursor-ring-hover');
      }
    };
    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, select, label[for]')) {
        ringRef.current?.classList.remove('cursor-ring-hover');
      }
    };

    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    const tick = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx - 3}px, ${my - 3}px, 0)`;
      }

      // Ring follows with lag (lerp 0.1)
      ringPos.current.x += (mx - ringPos.current.x) * 0.1;
      ringPos.current.y += (my - ringPos.current.y) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x - 16}px, ${ringPos.current.y - 16}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const handleVisibility = () => {
      if (document.hidden) cancelAnimationFrame(rafRef.current);
      else rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [handleMouseMove]);

  // SSR guard: only render on desktop
  if (
    typeof window !== 'undefined' &&
    (window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  ) {
    return null;
  }

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          zIndex: 10001,
          backgroundColor: '#4ddbff',
          boxShadow: '0 0 8px #4ddbff',
          willChange: 'transform',
        }}
      />

      {/* Concentric cursor ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none cursor-ring"
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1px solid rgba(77, 219, 255, 0.5)',
          zIndex: 10000,
          willChange: 'transform',
          transition: 'width 0.3s cubic-bezier(.23,1,.32,1), height 0.3s cubic-bezier(.23,1,.32,1), border-color 0.3s',
        }}
      />
    </>
  );
}
