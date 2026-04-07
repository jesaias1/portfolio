'use client';

import { useEffect, useRef } from 'react';

export default function SectionDivider() {
  const pulseLeftRef = useRef<HTMLDivElement>(null);
  const pulseRightRef = useRef<HTMLDivElement>(null);
  const nodeLeftRef = useRef<HTMLDivElement>(null);
  const nodeRightRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use CSS animations instead of Framer Motion infinite animations
    // This keeps the dividers purely CSS-driven after mount
  }, []);

  return (
    <div className="relative py-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative flex items-center gap-4">
          {/* Left node */}
          <div
            ref={nodeLeftRef}
            className="w-2 h-2 bg-[#4ddbff]/50 shrink-0 relative section-divider-node"
          />
          
          {/* Animated line */}
          <div className="flex-1 relative h-px">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4ddbff]/20 via-[#4ddbff]/08 to-transparent" />
            {/* Traveling pulse */}
            <div
              ref={pulseLeftRef}
              className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-transparent via-[#4ddbff]/50 to-transparent section-divider-pulse-left"
            />
          </div>

          {/* Center terminal marker */}
          <div
            ref={centerRef}
            className="shrink-0 flex items-center gap-2 section-divider-center"
          >
            <div className="w-4 h-px bg-[#4ddbff]/20" />
            <span className="font-mono text-[9px] text-[#4ddbff]/30 tracking-[0.3em]">
              ○
            </span>
            <div className="w-4 h-px bg-[#4ddbff]/20" />
          </div>

          {/* Right line */}
          <div className="flex-1 relative h-px">
            <div className="absolute inset-0 bg-gradient-to-l from-[#4ddbff]/20 via-[#4ddbff]/08 to-transparent" />
            {/* Traveling pulse (reverse) */}
            <div
              ref={pulseRightRef}
              className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent via-[#4ddbff]/50 to-transparent section-divider-pulse-right"
            />
          </div>

          {/* Right node */}
          <div
            ref={nodeRightRef}
            className="w-2 h-2 bg-[#4ddbff]/50 shrink-0 section-divider-node section-divider-node-delayed"
          />
        </div>
      </div>
    </div>
  );
}
