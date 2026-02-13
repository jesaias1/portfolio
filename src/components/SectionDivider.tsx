'use client';

import { motion } from 'framer-motion';

export default function SectionDivider() {
  return (
    <div className="relative py-8 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative flex items-center gap-4">
          {/* Left dot */}
          <motion.div
            className="w-1.5 h-1.5 bg-[#00ff41]/40 shrink-0"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* Animated line */}
          <div className="flex-1 relative h-px">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00ff41]/20 via-[#00d4ff]/10 to-transparent" />
            <motion.div
              className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-transparent via-[#00ff41]/40 to-transparent"
              animate={{ x: ['-10%', '500%'] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
                repeatDelay: 2,
              }}
            />
          </div>

          {/* Center marker */}
          <motion.span
            className="font-mono text-[9px] text-gray-700 tracking-widest shrink-0"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            ···
          </motion.span>

          {/* Right line */}
          <div className="flex-1 relative h-px">
            <div className="absolute inset-0 bg-gradient-to-l from-[#00ff41]/20 via-[#00d4ff]/10 to-transparent" />
          </div>

          {/* Right dot */}
          <motion.div
            className="w-1.5 h-1.5 bg-[#00ff41]/40 shrink-0"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          />
        </div>
      </div>
    </div>
  );
}
