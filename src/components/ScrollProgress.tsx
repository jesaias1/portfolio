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
      {/* Top progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 origin-left z-50"
        style={{ scaleX }}
      />
      
      {/* Side scroll indicator */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
        <div className="flex flex-col items-center gap-3">
          {['Om', 'Projekter', 'Kontakt'].map((section, index) => (
            <motion.a
              key={section}
              href={`#${section.toLowerCase()}`}
              className="group flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
            >
              <span className="text-xs tracking-widest text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {section.toUpperCase()}
              </span>
              <motion.div
                className="w-2 h-2 rounded-full border border-white/30"
                whileHover={{ scale: 1.5, borderColor: 'rgba(99, 102, 241, 1)' }}
              >
                <motion.div
                  className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-500"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: index === 0 ? 1 : 0 }}
                  viewport={{ amount: 0.5 }}
                />
              </motion.div>
            </motion.a>
          ))}
        </div>
      </div>
    </>
  );
}
