'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function RevealText({ text, className = "", delay = 0 }: RevealTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.span
      ref={ref}
      style={{ display: "inline-block" }}
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      animate={isInView ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
      transition={{
        duration: 1.1,
        delay,
        ease: [0.76, 0, 0.24, 1], // power4.inOut equivalent
      }}
      onAnimationStart={() => {
        // Trigger glitch flash when heading reveals
        if (isInView) {
          window.dispatchEvent(new Event('glitch-flash'));
        }
      }}
      className={className}
    >
      {text}
    </motion.span>
  );
}
