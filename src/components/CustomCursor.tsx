'use client';

import { useEffect, useRef, useCallback } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const glowPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  }, []);

  useEffect(() => {
    // Only show on desktop (fine pointer)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const tick = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Dot follows fast
      dotPos.current.x += (mx - dotPos.current.x) * 0.35;
      dotPos.current.y += (my - dotPos.current.y) * 0.35;

      // Glow follows slower
      glowPos.current.x += (mx - glowPos.current.x) * 0.1;
      glowPos.current.y += (my - glowPos.current.y) * 0.1;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x - 6}px, ${dotPos.current.y - 6}px, 0)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowPos.current.x - 96}px, ${glowPos.current.y - 96}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  // SSR guard: only render on desktop
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-3 h-3 pointer-events-none mix-blend-difference"
        style={{
          zIndex: 99999,
          backgroundColor: '#4ddbff',
          boxShadow: '0 0 8px rgba(77, 219, 255, 0.6), 0 0 20px rgba(77, 219, 255, 0.2)',
          willChange: 'transform',
        }}
      />

      {/* Trailing glow */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-48 h-48 rounded-full pointer-events-none"
        style={{
          zIndex: 9998,
          background: 'radial-gradient(circle, rgba(77, 219, 255, 0.06) 0%, rgba(153, 234, 255, 0.03) 40%, transparent 70%)',
          willChange: 'transform',
        }}
      />
    </>
  );
}
