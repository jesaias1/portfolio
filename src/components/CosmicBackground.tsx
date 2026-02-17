'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useMemo } from 'react';

export default function CosmicBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 80, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Pre-compute random positions for particles (stable across renders)
  const particles = useMemo(() => 
    Array.from({ length: 30 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.3 + 0.1,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
    })), []
  );

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none will-change-transform">
      {/* Layer 1: Deep black base */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      {/* Layer 2: Subtle gradient accents */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute rounded-full blur-[120px] opacity-20"
          style={{
            width: '600px',
            height: '600px',
            left: '10%',
            top: '20%',
            background: 'radial-gradient(circle, rgba(77, 219, 255, 0.15) 0%, transparent 70%)',
            x: useTransform(smoothX, value => (value / (typeof window !== 'undefined' ? window.innerWidth : 1920) - 0.5) * 30),
            y: useTransform(smoothY, value => (value / (typeof window !== 'undefined' ? window.innerHeight : 1080) - 0.5) * 30),
          }}
        />
        <motion.div
          className="absolute rounded-full blur-[120px] opacity-15"
          style={{
            width: '500px',
            height: '500px',
            right: '10%',
            bottom: '20%',
            background: 'radial-gradient(circle, rgba(153, 234, 255, 0.12) 0%, transparent 70%)',
            x: useTransform(smoothX, value => (value / (typeof window !== 'undefined' ? window.innerWidth : 1920) - 0.5) * -20),
            y: useTransform(smoothY, value => (value / (typeof window !== 'undefined' ? window.innerHeight : 1080) - 0.5) * -20),
          }}
        />
      </div>

      {/* Layer 3: Floating tiny dots (stars → data points) */}
      <div className="absolute inset-0">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute bg-[#4ddbff]"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
            }}
            animate={{
              opacity: [p.opacity, p.opacity * 2, p.opacity],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Layer 4: Mouse-following glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(77, 219, 255, 0.08) 0%, transparent 70%)',
          left: -300,
          top: -300,
          x: smoothX,
          y: smoothY,
        }}
      />
    </div>
  );
}
