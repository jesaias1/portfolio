'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CosmicBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Smooth spring physics for mouse follow - slower/smoother
  const springConfig = { damping: 50, stiffness: 100 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      
      mouseX.set(x * 20); // Reduced movement range
      mouseY.set(y * 20);
      
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      {/* Layer 1: Deep space base */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />

      {/* Layer 2: Slow moving nebula */}
      <motion.div
        className="absolute inset-0 opacity-40"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl opacity-30"
            style={{
              width: `${500 + i * 200}px`,
              height: `${500 + i * 200}px`,
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
              background: i === 0 
                ? 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)'
                : i === 1
                ? 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
              x: mouseX,
              y: mouseY,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 20 + i * 5, // Much slower
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      {/* Layer 3: Tiny stars */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 2 + 0.5,
              height: Math.random() * 2 + 0.5,
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 5, // Slower twinkling
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Layer 5: Mouse-following glow */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
          left: 0, 
          top: 0, 
          translateX: useTransform(mouseX, value => `calc(${mousePosition.x}px - 50%)`),
          translateY: useTransform(mouseY, value => `calc(${mousePosition.y}px - 50%)`),
        }}
        // Using direct translation instead of useTransform on logic to be smoother
        animate={{
          x: mousePosition.x - 400,
          y: mousePosition.y - 400,
        }}
        transition={{
          type: "spring",
          damping: 50,
          stiffness: 400,
          mass: 0.5
        }}
      />
    </div>
  );
}
