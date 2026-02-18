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
      {/* Top progress bar — terminal cyan */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[100]"
        style={{ 
          scaleX,
          background: 'linear-gradient(90deg, #4ddbff, #00b8e6)',
          boxShadow: '0 0 15px rgba(77, 219, 255, 0.4)',
        }}
      />
    </>
  );
}
