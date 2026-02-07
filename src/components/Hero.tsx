'use client';

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { HiArrowDown } from 'react-icons/hi';
import { useEffect, useState, useRef } from 'react';

export default function Hero() {
  const [isHovering, setIsHovering] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  
  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  const words = [
    { original: "Kreativ", replacement: "Reaktiv" },
    { original: "Udvikler", replacement: "Udvikler" }
  ];

  return (
    <section 
      ref={heroRef}
      id="home" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden pb-20 pt-20"
    >
      {/* Background is now global in layout.tsx */}


      {/* Main Content */}
      <motion.div 
        className="max-w-7xl mx-auto px-6 relative z-10"
        style={{ opacity, scale }}
      >
        <div className="text-center space-y-12">
          {/* Name removed as requested */}

          {/* Kreativ/Reaktiv transformation */}
          <div 
            className="overflow-hidden cursor-pointer relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <motion.div className="space-y-2">
              {words.map((word, wordIndex) => (
                <div key={wordIndex} className="overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    <motion.h2
                      key={isHovering ? word.replacement : word.original}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -100, opacity: 0 }}
                      transition={{ 
                        duration: 0.6,
                        ease: [0.6, 0.05, 0.01, 0.9]
                      }}
                      className="text-6xl md:text-8xl lg:text-[10rem] font-display font-light tracking-tighter leading-none"
                    >
                      {(isHovering ? word.replacement : word.original).split('').map((char, charIndex) => (
                        <motion.span
                          key={charIndex}
                          whileHover={{ 
                            scale: 1.2,
                            color: wordIndex === 0 ? '#a855f7' : '#ec4899',
                            textShadow: wordIndex === 0 
                              ? '0 0 30px rgba(168, 85, 247, 0.8)'
                              : '0 0 30px rgba(236, 72, 153, 0.8)',
                            transition: { duration: 0.2 }
                          }}
                          className="inline-block cursor-default"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </motion.h2>
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Tagline with glitch effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="relative"
          >
            <motion.p
              className="text-xl md:text-3xl text-gray-300 font-light tracking-widest"
              animate={{
                textShadow: [
                  '0 0 10px rgba(168, 85, 247, 0.3)',
                  '0 0 20px rgba(236, 72, 153, 0.3)',
                  '0 0 10px rgba(168, 85, 247, 0.3)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              SKABER DIGITALE OPLEVELSER
            </motion.p>
          </motion.div>

          {/* CTA Buttons with magnetic effect */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
          >
            <MagneticButton href="#projects">
              SE MINE PROJEKTER
            </MagneticButton>
            <MagneticButton href="#contact" variant="outline">
              KONTAKT MIG
            </MagneticButton>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.a
              href="#about"
              className="flex flex-col items-center text-gray-400 hover:text-white transition-colors group"
            >
              <motion.span 
                className="text-xs tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                SCROLL
              </motion.span>
              <motion.div
                animate={{ 
                  y: [0, 8, 0],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <HiArrowDown className="text-xl" />
              </motion.div>
              <motion.div
                className="w-px h-10 bg-gradient-to-b from-purple-500/50 via-pink-500/50 to-transparent mt-2"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1, delay: 2.5 }}
                style={{ transformOrigin: 'top' }}
              />
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      {/* Corner decorations removed as per user request */}
    </section>
  );
}

// Magnetic button with enhanced effects
function MagneticButton({ 
  children, 
  href, 
  variant = 'solid' 
}: { 
  children: React.ReactNode; 
  href: string; 
  variant?: 'solid' | 'outline';
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.4, y: y * 0.4 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.a
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative px-12 py-5 font-medium text-sm tracking-widest overflow-hidden group
        ${variant === 'solid' 
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
          : 'bg-transparent border-2 border-white/20 text-white'
        }
      `}
      style={{
        boxShadow: isHovered && variant === 'solid'
          ? '0 0 40px rgba(168, 85, 247, 0.6)'
          : 'none',
      }}
    >
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20"
        initial={{ x: '-100%' }}
        animate={isHovered ? { x: '100%' } : { x: '-100%' }}
        transition={{ duration: 0.8 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.a>
  );
}
