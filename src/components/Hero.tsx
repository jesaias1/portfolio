'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useSound } from '@/hooks/use-sound';
import TerminalOverlay from './TerminalOverlay';
import { useLenis } from 'lenis/react';
import dynamic from 'next/dynamic';

const Logo3D = dynamic(() => import('./Logo3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-[#4ddbff] font-mono text-sm animate-pulse" style={{ textShadow: '0 0 10px rgba(77, 219, 255, 0.4)' }}>
        loading_3d_engine...
      </div>
    </div>
  ),
});

/* ASCII_LOGO removed — replaced with 3D Logo component */

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const introInView = useInView(introRef, { once: true, margin: '-80px' });
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [subtitleText, setSubtitleText] = useState('');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const { play } = useSound();
  const lenis = useLenis();

  const handleNavClick = (href: string) => {
    play('click');
    
    if (href.startsWith('#')) {
      const el = document.querySelector(href) as HTMLElement;
      if (el) {
        if (lenis) {
          lenis.scrollTo(el, {
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      window.dispatchEvent(new CustomEvent('glitch-trigger'));
      setTimeout(() => {
        window.location.href = href;
      }, 400);
    }
  };
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const logoOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const logoScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.85]);
  const logoY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const fullSubtitle = '> creative_developer --fullstack --systems --design';

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

  // Trigger subtitle typing when intro section scrolls into view
  useEffect(() => {
    if (introInView && !subtitleVisible) {
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
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [introInView, subtitleVisible]);

  return (
    <>
      {/* ═══════════════════════════════════════════════
          HERO — Full viewport, 3D logo only
          ═══════════════════════════════════════════════ */}
      <section 
        ref={heroRef}
        id="home" 
        className="h-screen flex items-center justify-center relative"
      >
        {/* 3D Logo — renders as fullscreen fixed canvas, controlled by scroll opacity */}
        <motion.div
          style={{ opacity: logoOpacity, scale: logoScale }}
          className="fixed inset-0 z-20 pointer-events-none"
        >
          <Logo3D />
        </motion.div>

        {/* Scroll indicator — anchored to bottom of hero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs font-mono text-gray-600 tracking-widest">SCROLL</span>
            <div className="w-px h-8 bg-gradient-to-b from-[#4ddbff]/50 to-transparent scroll-pulse" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          INTRO — Scroll-triggered reveal below the fold
          ═══════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32" ref={introRef}>
        <div className="flex flex-col items-center px-4">
          {/* Typing subtitle — triggers when scrolled into view */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={introInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
            className="h-8 flex items-center justify-center"
          >
            <span 
              className="font-mono text-[11px] sm:text-sm md:text-base text-[#4ddbff] tracking-wider"
              style={{ textShadow: '0 0 10px rgba(77, 219, 255, 0.4)' }}
            >
              {subtitleText}
              {subtitleVisible && <span className="cursor-blink ml-0.5">▌</span>}
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={introInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.6, 0.05, 0.01, 0.9] }}
            className="text-xl md:text-3xl lg:text-4xl text-gray-200 font-light tracking-[0.1em] max-w-3xl mx-auto text-center mt-6"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,1), 0 4px 30px rgba(0,0,0,0.8), 0 0 20px rgba(77, 219, 255, 0.15)' }}
          >
            Creating digital experiences that transcend boundaries
          </motion.p>

          {/* CTA Buttons — terminal commands */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={introInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 md:mt-14 relative z-40 pointer-events-auto"
          >
            <TerminalButton onClick={() => { play('click'); setIsTerminalOpen(true); }}>
              ./root_access
            </TerminalButton>
            <TerminalButton onClick={() => handleNavClick('#projects')} variant="outline">
              ./view_projects
            </TerminalButton>
            <TerminalButton onClick={() => handleNavClick('#contact')} variant="outline">
              ./contact
            </TerminalButton>
          </motion.div>
        </div>
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
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      onMouseEnter={() => play('hover')}
      onClick={() => {
        play('click');
        onClick?.();
      }}
      className={`
        relative px-8 py-3.5 font-mono text-sm tracking-wider overflow-hidden group transition-all duration-300 cursor-pointer
        ${variant === 'solid' 
          ? 'bg-[#4ddbff]/10 border border-[#4ddbff]/40 text-[#4ddbff] hover:bg-[#4ddbff]/20 hover:border-[#4ddbff]/80' 
          : 'bg-white/[0.02] border border-gray-700 text-gray-400 hover:border-[#4ddbff]/40 hover:text-[#4ddbff]/80 hover:bg-[#4ddbff]/5'
        }
      `}
      style={{
        boxShadow: variant === 'solid' 
          ? '0 0 20px rgba(77, 219, 255, 0.1), inset 0 1px 0 rgba(77, 219, 255, 0.1)' 
          : 'inset 0 1px 0 rgba(255, 255, 255, 0.03)',
      }}
    >
      {/* Hover sweep glow */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: variant === 'solid' 
            ? 'linear-gradient(90deg, transparent, rgba(77, 219, 255, 0.08), transparent)' 
            : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03), transparent)',
        }}
      />
      {/* Scan line sweep on hover */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4ddbff]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <span className="relative z-10">{children}</span>
    </motion.div>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return content;
}
