'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useSound } from '@/hooks/use-sound';

const ASCII_LOGO = `.-
.##-                                                     .................
  .#######################################################################-
     .####################################################################-

                                                          .++######+-.
                                                    .+#############++##-.
            -#.                                -#############+.       .##.
           +#-                           .############+-..              ##
          .#-                      .+###########+-..                     #+
          -#                  -############..                            ##
          .#-         .--############-.                                  ##
           -#+. .-+############-.                                       -#.
            .+###########+..                                           -#.
               ..---..`;

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [subtitleText, setSubtitleText] = useState('');
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  const fullSubtitle = '> kreativ_udvikler --fullstack --audio --design';

  useEffect(() => {
    const timer = setTimeout(() => {
      setSubtitleVisible(true);
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        charIndex++;
        setSubtitleText(fullSubtitle.slice(0, charIndex));
        if (charIndex >= fullSubtitle.length) {
          clearInterval(typeInterval);
        }
      }, 35);
      return () => clearInterval(typeInterval);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Waveform bars — pre-computed for stability
  const waveformBars = useMemo(() => 
    Array.from({ length: 80 }, (_, i) => ({
      delay: i * 0.03,
      height: Math.random() * 60 + 10,
      duration: 0.8 + Math.random() * 0.6,
    })), []
  );

  return (
    <section 
      ref={heroRef}
      id="home" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Audio waveform background visualization */}
      <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center gap-[2px] opacity-[0.07] overflow-hidden">
        {waveformBars.map((bar, i) => (
          <motion.div
            key={i}
            className="w-[3px] bg-[#4ddbff]"
            animate={{
              height: [bar.height * 0.3, bar.height, bar.height * 0.5, bar.height * 0.8, bar.height * 0.3],
            }}
            transition={{
              duration: bar.duration,
              repeat: Infinity,
              delay: bar.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div 
        className="w-full relative z-10 px-4"
        style={{ opacity, y }}
      >
        <div className="flex flex-col items-center space-y-8">
          {/* ASCII Logo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
            className="hero-logo-glow w-full flex justify-center overflow-hidden"
          >
            <div className="relative inline-block origin-center scale-[0.55] sm:scale-[0.7] md:scale-90 lg:scale-100 transition-transform">
              <pre
                className="text-[#4ddbff] text-[0.65rem] leading-tight font-mono select-none whitespace-pre text-left"
                style={{ textShadow: '0 0 15px rgba(77, 219, 255, 0.4), 0 0 30px rgba(77, 219, 255, 0.15)' }}
              >
                {ASCII_LOGO}
              </pre>
              {/* Glitch overlay */}
              <motion.pre
                className="absolute inset-0 text-[#99eaff] text-[0.65rem] leading-tight font-mono select-none whitespace-pre overflow-hidden pointer-events-none text-left"
                animate={{
                  opacity: [0, 0.3, 0, 0, 0.2, 0],
                  x: [-2, 2, 0, -1, 1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
                style={{ mixBlendMode: 'screen' }}
              >
                {ASCII_LOGO}
              </motion.pre>
            </div>
          </motion.div>

          {/* Typing subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: subtitleVisible ? 1 : 0 }}
            className="h-8 flex items-center justify-center"
          >
            <span 
              className="font-mono text-[11px] sm:text-sm md:text-base text-[#4ddbff] tracking-wider"
              style={{ textShadow: '0 0 10px rgba(77, 219, 255, 0.4)' }}
            >
              {subtitleText}
              <span className="cursor-blink ml-0.5">▌</span>
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.5 }}
            className="text-lg md:text-xl text-gray-500 font-light tracking-wide max-w-xl mx-auto"
          >
            Skaber digitale oplevelser der overskrider grænserne
          </motion.p>

          {/* CTA Buttons — terminal commands */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <TerminalButton href="#projects">
              ./view_projects
            </TerminalButton>
            <TerminalButton href="#contact" variant="outline">
              ./kontakt
            </TerminalButton>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5 }}
            className="pt-16"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs font-mono text-gray-600 tracking-widest">SCROLL</span>
              <div className="w-px h-8 bg-gradient-to-b from-[#4ddbff]/50 to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function TerminalButton({ 
  children, 
  href, 
  variant = 'solid' 
}: { 
  children: React.ReactNode; 
  href: string; 
  variant?: 'solid' | 'outline';
}) {
  const { play } = useSound();

  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => play('hover')}
      onClick={() => play('click')}
      className={`
        relative px-8 py-3 font-mono text-sm tracking-wider overflow-hidden group transition-all
        ${variant === 'solid' 
          ? 'bg-[#4ddbff]/10 border border-[#4ddbff]/40 text-[#4ddbff] hover:bg-[#4ddbff]/20 hover:border-[#4ddbff]/70' 
          : 'bg-transparent border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
        }
      `}
      style={{
        boxShadow: variant === 'solid' ? '0 0 20px rgba(77, 219, 255, 0.1)' : 'none',
      }}
    >
      <span className="relative z-10">{children}</span>
    </motion.a>
  );
}
