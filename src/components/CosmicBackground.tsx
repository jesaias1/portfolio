'use client';

import { useEffect, useRef, useCallback } from 'react';

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = e.clientX / window.innerWidth;
    mouseRef.current.y = e.clientY / window.innerHeight;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true })!;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Generate particles once
    const particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      baseOpacity: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 0.0008 + 0.0004,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
      // Reposition particles on resize
      particles.forEach(p => {
        p.x = Math.random() * width;
        p.y = Math.random() * height;
      });
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const draw = (time: number) => {
      // Smooth mouse follow
      smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * 0.03;
      smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * 0.03;

      ctx.clearRect(0, 0, width, height);

      // Semi-transparent dark overlay
      ctx.fillStyle = 'rgba(10, 10, 10, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // Gradient orbs that follow mouse (subtle)
      const mx = smoothMouseRef.current.x;
      const my = smoothMouseRef.current.y;

      // Orb 1
      const ox1 = width * 0.1 + (mx - 0.5) * 30;
      const oy1 = height * 0.2 + (my - 0.5) * 30;
      const grad1 = ctx.createRadialGradient(ox1, oy1, 0, ox1, oy1, 300);
      grad1.addColorStop(0, 'rgba(77, 219, 255, 0.04)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Orb 2
      const ox2 = width * 0.9 + (mx - 0.5) * -20;
      const oy2 = height * 0.8 + (my - 0.5) * -20;
      const grad2 = ctx.createRadialGradient(ox2, oy2, 0, ox2, oy2, 250);
      grad2.addColorStop(0, 'rgba(153, 234, 255, 0.03)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Mouse glow
      const gx = mx * width;
      const gy = my * height;
      const gradMouse = ctx.createRadialGradient(gx, gy, 0, gx, gy, 300);
      gradMouse.addColorStop(0, 'rgba(77, 219, 255, 0.04)');
      gradMouse.addColorStop(1, 'transparent');
      ctx.fillStyle = gradMouse;
      ctx.fillRect(0, 0, width, height);

      // Particles (twinkling dots)
      const t = time * 0.001;
      for (const p of particles) {
        const opacity = p.baseOpacity + Math.sin(t * p.speed * 1000 + p.phase) * p.baseOpacity * 0.5;
        ctx.fillStyle = `rgba(77, 219, 255, ${opacity})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -50 }}
    />
  );
}
