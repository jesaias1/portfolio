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

  // Always mounted so the page tree is not remounted when the scroll mode is decided after hydration.
  return (
    <ReactLenis
      root
      options={{
        duration: useEnhancedScroll ? 1.2 : 0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: useEnhancedScroll,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
