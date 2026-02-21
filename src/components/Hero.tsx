'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useSound } from '@/hooks/use-sound';
import TerminalOverlay from './TerminalOverlay';
import { useLenis } from 'lenis/react';

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
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const { play } = useSound();
  const lenis = useLenis();

  const handleNavClick = (href: string) => {
    play('click');
    window.dispatchEvent(new CustomEvent('glitch-trigger'));
    
    setTimeout(() => {
      if (lenis && href.startsWith('#')) {
        lenis.scrollTo(href, {
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    }, 400);
  };
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  const fullSubtitle = '> kreativ_udvikler --fullstack --audio --design';

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' || e.key === '`') {
        // Only trigger if not already typing in an input
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setIsTerminalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    <>
      <section 
        ref={heroRef}
        id="home" 
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        {/* Soft Vignette Overlay to maintain contrast without hiding video */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] z-0" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/60 z-0" />

        {/* Audio waveform background visualization */}
        <div className="absolute bottom-0 left-0 right-0 h-40 flex items-end justify-center gap-[3px] opacity-[0.25] overflow-hidden mix-blend-screen drop-shadow-[0_0_15px_rgba(77,219,255,0.6)] z-0">
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
                  className="text-[#4ddbff] text-[0.65rem] leading-tight font-mono select-none whitespace-pre text-left font-bold"
                  style={{ textShadow: '0 0 20px rgba(77, 219, 255, 0.6), 0 0 40px rgba(77, 219, 255, 0.3), 0 0 80px rgba(77, 219, 255, 0.1)' }}
                >
                  {ASCII_LOGO}
                </pre>
                {/* Glitch overlay */}
                <motion.pre
                  className="absolute inset-0 text-[#ffffff] text-[0.65rem] leading-tight font-mono select-none whitespace-pre overflow-hidden pointer-events-none text-left drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
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
              className="text-xl md:text-2xl text-gray-200 font-light tracking-[0.15em] max-w-2xl mx-auto text-center"
              style={{ textShadow: '0 2px 15px rgba(0,0,0,1), 0 0 20px rgba(77, 219, 255, 0.2)' }}
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
              <TerminalButton onClick={() => { play('click'); setIsTerminalOpen(true); }}>
                ./root_access
              </TerminalButton>
              <TerminalButton onClick={() => handleNavClick('#projects')} variant="outline">
                ./view_projects
              </TerminalButton>
              <TerminalButton onClick={() => handleNavClick('#contact')} variant="outline">
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

      <TerminalOverlay 
        isOpen={isTerminalOpen} 
        onClose={() => setIsTerminalOpen(false)} 
      />
    </>
  );
}

function TerminalButton({ 
  children, 
  href, 
  onClick,
  variant = 'solid' 
}: { 
  children: React.ReactNode; 
  href?: string; 
  onClick?: () => void;
  variant?: 'solid' | 'outline';
}) {
  const { play } = useSound();

  const content = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => play('hover')}
      onClick={() => {
        play('click');
        window.dispatchEvent(new CustomEvent('glitch-trigger'));
        onClick?.();
      }}
      className={`
        relative px-8 py-3 font-mono text-sm tracking-wider overflow-hidden group transition-all cursor-pointer
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
    </motion.div>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return content;
}
