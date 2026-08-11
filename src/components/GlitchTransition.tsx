'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const GLITCH_SLICES = [
  'inset(12% 0 68% 0)',
  'inset(28% 0 52% 0)',
  'inset(44% 0 38% 0)',
  'inset(8% 0 76% 0)',
  'inset(58% 0 24% 0)',
  'inset(72% 0 12% 0)',
  'inset(36% 0 48% 0)',
  'inset(18% 0 62% 0)',
];

export default function GlitchTransition() {
  const [key, setKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mode, setMode] = useState<'glitch' | 'audio'>('glitch');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const startTransition = (nextMode: 'glitch' | 'audio') => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      setMode(nextMode);
      setKey(prev => prev + 1);
      setIsTransitioning(true);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setIsTransitioning(false), nextMode === 'audio' ? 460 : 720);
    };
    const handleTrigger = () => startTransition('glitch');
    const handleAudioTrigger = () => startTransition('audio');

    window.addEventListener('glitch-trigger', handleTrigger);
    window.addEventListener('audio-transition-trigger', handleAudioTrigger);
    return () => {
      window.removeEventListener('glitch-trigger', handleTrigger);
      window.removeEventListener('audio-transition-trigger', handleAudioTrigger);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const isAudio = mode === 'audio';

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key={key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: isAudio ? 0.12 : 0.16 }}
          className="fixed inset-0 z-[100] pointer-events-none flex flex-col items-center justify-center bg-[#0a0a0a]"
        >
          {/* Cover Layer */}
          <motion.div
            initial={isAudio ? { opacity: 0, scaleX: 0.96 } : { scaleY: 0 }}
            animate={isAudio ? { opacity: 1, scaleX: 1 } : { scaleY: 1 }}
            exit={isAudio ? { opacity: 0 } : { scaleY: 0 }}
            transition={{ duration: isAudio ? 0.22 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute inset-0 ${isAudio ? 'origin-center bg-[radial-gradient(circle_at_50%_40%,rgba(77,219,255,0.14),transparent_34%),#050707]' : 'origin-top bg-[#0a0a0a]'}`}
          />

          {/* Glitch Slices during cover */}
          {!isAudio && [...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
              animate={{ 
                clipPath: [
                  GLITCH_SLICES[i],
                  `inset(0 0 0 0)`
                ],
                opacity: [0, 0.1, 0]
              }}
              transition={{ duration: 0.2, delay: 0.035 * i }}
              className="absolute inset-0 bg-[#4ddbff]"
            />
          ))}

          {/* Final Pulse */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isAudio ? [0, 0.12, 0] : [0, 0.2, 0] }}
            transition={{ duration: isAudio ? 0.26 : 0.3, delay: isAudio ? 0.08 : 0.22 }}
            className="absolute inset-0 bg-[#4ddbff]"
          />

          {/* Scanline */}
          <motion.div
            initial={{ top: '0%', opacity: 0 }}
            animate={{ top: '100%', opacity: 1 }}
            transition={{ duration: isAudio ? 0.24 : 0.32, ease: "linear" }}
            className={`${isAudio ? 'absolute h-[2px] w-full bg-white/70 shadow-[0_0_26px_rgba(77,219,255,0.8)]' : 'absolute h-px w-full bg-[#4ddbff] shadow-[0_0_20px_#4ddbff]'}`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
