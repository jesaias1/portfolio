'use client';

import { motion } from 'framer-motion';

export default function SectionDivider() {
  return (
    <div className="relative py-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative flex items-center gap-4">
          {/* Left node */}
          <motion.div
            className="w-2 h-2 bg-[#4ddbff]/50 shrink-0 relative"
            animate={{ opacity: [0.3, 1, 0.3], boxShadow: ['0 0 0px rgba(77,219,255,0)', '0 0 8px rgba(77,219,255,0.4)', '0 0 0px rgba(77,219,255,0)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* Animated line */}
          <div className="flex-1 relative h-px">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4ddbff]/20 via-[#4ddbff]/08 to-transparent" />
            {/* Traveling pulse */}
            <motion.div
              className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-transparent via-[#4ddbff]/50 to-transparent"
              animate={{ x: ['-10%', '600%'] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
                repeatDelay: 2,
              }}
            />
          </div>

          {/* Center terminal marker */}
          <motion.div
            className="shrink-0 flex items-center gap-2"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="w-4 h-px bg-[#4ddbff]/20" />
            <span className="font-mono text-[9px] text-[#4ddbff]/30 tracking-[0.3em]">
              ○
            </span>
            <div className="w-4 h-px bg-[#4ddbff]/20" />
          </motion.div>

          {/* Right line */}
          <div className="flex-1 relative h-px">
            <div className="absolute inset-0 bg-gradient-to-l from-[#4ddbff]/20 via-[#4ddbff]/08 to-transparent" />
            {/* Traveling pulse (reverse) */}
            <motion.div
              className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent via-[#4ddbff]/50 to-transparent"
              animate={{ x: ['10%', '-600%'] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
                repeatDelay: 3,
              }}
            />
          </div>

          {/* Right node */}
          <motion.div
            className="w-2 h-2 bg-[#4ddbff]/50 shrink-0"
            animate={{ opacity: [0.3, 1, 0.3], boxShadow: ['0 0 0px rgba(77,219,255,0)', '0 0 8px rgba(77,219,255,0.4)', '0 0 0px rgba(77,219,255,0)'] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          />
        </div>
      </div>
    </div>
  );
}
