'use client';

import { motion, useScroll, useTransform, useSpring, AnimatePresence, LayoutGroup } from 'framer-motion';
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
          {/* Kreativ/Reaktiv transformation */}
          <div 
            className="cursor-pointer relative h-[1.1em] overflow-visible"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
             {/* LayoutGroup enables shared layout animations between components */}
            <LayoutGroup id="kreativ-reaktiv-switch">
               <LetterSwap isHovering={isHovering} />
            </LayoutGroup>
          </div>
          
          <div className="mt-4">
             <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-display font-light tracking-tighter leading-none text-white">
                Udvikler
             </h2>
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


        </div>
      </motion.div>

      {/* Corner decorations removed as per user request */}
    </section>
  );
}

// Letter swapping component
function LetterSwap({ isHovering }: { isHovering: boolean }) {
  const words = [
    { text: "Kreativ", chars: "KREATIV" }, 
    { text: "Reaktiv", chars: "REAKTIV" }
  ];
  
  // Map characters to unique layout IDs to track them across state changes
  // K-R-E-A-T-I-V -> R-E-A-K-T-I-V
  // We need to match the specific instances of letters
  
  const getLayoutId = (char: string, index: number, wordIndex: number) => {
    // We want to track specific letters. 
    // Kreativ: K(0), r(1), e(2), a(3), t(4), i(5), v(6)
    // Reaktiv: R(0), e(1), a(2), k(3), t(4), i(5), v(6)
    
    // Mapping:
    // K (Kreativ[0]) -> k (Reaktiv[3]) (Case change, but effectively same letter slot)
    // r (Kreativ[1]) -> R (Reaktiv[0])
    // e (Kreativ[2]) -> e (Reaktiv[1])
    // a (Kreativ[3]) -> a (Reaktiv[2])
    // t (Kreativ[4]) -> t (Reaktiv[4])
    // i (Kreativ[5]) -> i (Reaktiv[5])
    // v (Kreativ[6]) -> v (Reaktiv[6])
    
    // Simplified: Just use character + occurrence count if needed, but here all unique mostly.
    
    const idMap: {[key: string]: string} = {
      'K': 'k-1', 'r': 'r-1', 'e': 'e-1', 'a': 'a-1', 't': 't-1', 'i': 'i-1', 'v': 'v-1',
      'R': 'r-1', 'k': 'k-1' // Map upper/lowercase variants to same ID
    };
    
    return `char-${idMap[char] || char}-${index}`; // Fallback if needed, but manual map best
  };

  // Manual mapping for precise control
  // Kreativ: K(0), r(1), e(2), a(3), t(4), i(5), v(6)
  // Reaktiv: R(0), e(1), a(2), k(3), t(4), i(5), v(6)
  const layoutIds = isHovering 
    ? ['r-1', 'e-1', 'a-1', 'k-1', 't-1', 'i-1', 'v-1'] // Reaktiv
    : ['k-1', 'r-1', 'e-1', 'a-1', 't-1', 'i-1', 'v-1']; // Kreativ
    
  const currentText = isHovering ? "Reaktiv" : "Kreativ";

  return (
    <div className="flex justify-center">
      {currentText.split('').map((char, i) => (
        <motion.span
          layoutId={`letter-${layoutIds[i]}`}
          key={`letter-${layoutIds[i]}`}
          className={`inline-block text-6xl md:text-8xl lg:text-[10rem] font-display font-light tracking-tighter leading-none ${
             i === 0 && isHovering ? 'text-purple-400' : 'text-white'
          }`}
          transition={{
            type: "spring",
            stiffness: 70, // Slower
            damping: 12,   // Bouncier
            mass: 1.2
          }}
          style={{ 
            textShadow: i === 0 && isHovering ? '0 0 30px rgba(168, 85, 247, 0.8)' : undefined
          }}
        >
          {char}
        </motion.span>
      ))}
    </div>
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
