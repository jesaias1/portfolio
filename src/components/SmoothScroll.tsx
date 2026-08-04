'use client';

import { ReactLenis } from 'lenis/react';
import { useReducedMotion } from 'framer-motion';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <ReactLenis
      root
      options={{
        duration: shouldReduceMotion ? 0 : 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: !shouldReduceMotion,
        wheelMultiplier: 1,
        touchMultiplier: shouldReduceMotion ? 1 : 2,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
