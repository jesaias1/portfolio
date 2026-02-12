'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      {/* Top progress bar — terminal green */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50"
        style={{ 
          scaleX,
          background: 'linear-gradient(90deg, #00ff41, #00d4ff)',
          boxShadow: '0 0 10px rgba(0, 255, 65, 0.5)',
        }}
      />
    </>
  );
}
