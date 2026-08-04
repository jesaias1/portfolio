'use client';

import { ReactLenis } from 'lenis/react';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  const [useEnhancedScroll, setUseEnhancedScroll] = useState(false);

  useEffect(() => {
    const compactViewport = window.matchMedia('(max-width: 768px)');
    const coarsePointer = window.matchMedia('(pointer: coarse)');
    const update = () => {
      setUseEnhancedScroll(
        !compactViewport.matches && !coarsePointer.matches && !shouldReduceMotion
      );
    };

    update();
    compactViewport.addEventListener('change', update);
    coarsePointer.addEventListener('change', update);
    return () => {
      compactViewport.removeEventListener('change', update);
      coarsePointer.removeEventListener('change', update);
    };
  }, [shouldReduceMotion]);

  if (!useEnhancedScroll) return children;

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
