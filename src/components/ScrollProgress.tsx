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
          background: 'linear-gradient(90deg, #4ddbff, #99eaff)',
          boxShadow: '0 0 10px rgba(77, 219, 255, 0.5)',
        }}
      />
    </>
  );
}
