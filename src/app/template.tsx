'use client';

import GlitchTransition from '@/components/GlitchTransition';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlitchTransition />
      {children}
    </>
  );
}
