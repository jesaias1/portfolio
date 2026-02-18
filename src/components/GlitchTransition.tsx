'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function GlitchTransition() {
  const [key, setKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleTrigger = () => {
      setKey(prev => prev + 1);
      setIsTransitioning(true);
      // Mid-point of the transition (fully covered) is at 400ms
      // Transition out ends at 1000ms
      setTimeout(() => setIsTransitioning(false), 1000);
    };

    window.addEventListener('glitch-trigger', handleTrigger);
    return () => window.removeEventListener('glitch-trigger', handleTrigger);
  }, []);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key={key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] pointer-events-none flex flex-col items-center justify-center bg-[#0a0a0a]"
        >
          {/* Cover Layer */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-[#0a0a0a] origin-top"
          />

          {/* Glitch Slices during cover */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
              animate={{ 
                clipPath: [
                  `inset(${Math.random() * 80}% 0 ${Math.random() * 80}% 0)`,
                  `inset(0 0 0 0)`
                ],
                opacity: [0, 0.1, 0]
              }}
              transition={{ duration: 0.3, delay: 0.1 * i }}
              className="absolute inset-0 bg-[#4ddbff]"
            />
          ))}

          {/* Final Pulse */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0] }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="absolute inset-0 bg-[#4ddbff]"
          />

          {/* Scanline */}
          <motion.div
            initial={{ top: '0%', opacity: 0 }}
            animate={{ top: '100%', opacity: 1 }}
            transition={{ duration: 0.4, ease: "linear" }}
            className="absolute w-full h-px bg-[#4ddbff] shadow-[0_0_20px_#4ddbff]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
