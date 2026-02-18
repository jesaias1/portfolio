'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function GlitchTransition() {
  // We only run this on mount (which happens on every page navigation with template.tsx)
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] pointer-events-none flex flex-col items-center justify-center bg-[#0a0a0a]"
      style={{ mixBlendMode: 'hard-light' }} // Experiment with blend modes
    >
      {/* Dynamic Glitch Slices */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            height: '100%', 
            width: '100%', 
            clipPath: 'inset(0 0 0 0)' 
          }}
          animate={{ 
            clipPath: [
              `inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0)`,
              `inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0)`,
              `inset(100% 0 0 0)`
            ]
          }}
          transition={{ duration: 0.4, times: [0, 0.5, 1] }}
          className="absolute inset-0 bg-[#4ddbff] opacity-10"
        />
      ))}

      {/* Main Wipe */}
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-[#0a0a0a] origin-bottom"
      />

      {/* Scanline */}
      <motion.div
        initial={{ top: '0%' }}
        animate={{ top: '100%' }}
        transition={{ duration: 0.5, ease: "linear" }}
        className="absolute w-full h-px bg-[#4ddbff] shadow-[0_0_20px_#4ddbff] opacity-50"
      />
    </motion.div>
  );
}
