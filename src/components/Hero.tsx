'use client';

import { AnimatePresence, motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useSound } from '@/hooks/use-sound';
import TerminalOverlay from './TerminalOverlay';
import { useLenis } from 'lenis/react';
import dynamic from 'next/dynamic';
import type { LogoDragControls } from './Logo3D';

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

const FULL_SUBTITLE = '> creative_developer --software --audio --games';

export default function Hero({ playLogoIntro = false }: { playLogoIntro?: boolean }) {
  const heroRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const introInView = useInView(introRef, { once: true, margin: '-80px' });
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [subtitleText, setSubtitleText] = useState('');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isLogoReady, setIsLogoReady] = useState(false);
  const [logoPulse, setLogoPulse] = useState(0);
  const [showBlueprint, setShowBlueprint] = useState(true);
  const logoDragControls = useRef<LogoDragControls>({
    rotationX: 0,
    rotationY: 0,
    spinVelocity: 0,
    isDragging: false,
  });
  const logoDragStart = useRef({
    pointerId: -1,
    x: 0,
    y: 0,
    rotationX: 0,
    rotationY: 0,
    lastX: 0,
    lastTime: 0,
    moved: false,
  });
  const shouldReduceMotion = useReducedMotion();
  const { play } = useSound();
  const lenis = useLenis();
  const closeTerminal = useCallback(() => setIsTerminalOpen(false), []);
  const setHeroCursorHidden = useCallback((hidden: boolean) => {
    document.body.classList.toggle('hero-logo-cursor-hidden', hidden);
  }, []);
  const syncLogoDragControls = useCallback((nextControls: LogoDragControls) => {
    logoDragControls.current = nextControls;
  }, []);
  const handleLogoReady = useCallback(() => {
    setIsLogoReady(true);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) {
      setShowBlueprint(false);
      return;
    }

    const timer = window.setTimeout(() => setShowBlueprint(false), 2400);
    return () => window.clearTimeout(timer);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const stopDrag = () => {
      logoDragControls.current.isDragging = false;
      logoDragStart.current.pointerId = -1;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (logoDragStart.current.pointerId !== event.pointerId) return;

      const now = performance.now();
      const dx = event.clientX - logoDragStart.current.x;
      const dy = event.clientY - logoDragStart.current.y;
      const moveDistance = Math.hypot(dx, dy);
      logoDragStart.current.moved ||= moveDistance > 4;

      const nextRotationY = logoDragStart.current.rotationY + dx * 0.0046;
      const nextRotationX = logoDragStart.current.rotationX + dy * 0.0032;
      const timeDelta = Math.max(16, now - logoDragStart.current.lastTime);
      const xDelta = event.clientX - logoDragStart.current.lastX;

      logoDragControls.current.rotationY = nextRotationY;
      logoDragControls.current.rotationX = Math.max(-0.42, Math.min(0.42, nextRotationX));
      logoDragControls.current.spinVelocity = (xDelta / timeDelta) * 3.2;
      logoDragStart.current.lastX = event.clientX;
      logoDragStart.current.lastTime = now;
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (logoDragStart.current.pointerId !== event.pointerId) return;
      stopDrag();
    };

    const handleBlur = () => stopDrag();

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('blur', handleBlur);
      document.body.classList.remove('hero-logo-cursor-hidden');
    };
  }, [shouldReduceMotion]);

  const handleNavClick = (href: string) => {
    play('click');
    
    if (href.startsWith('#')) {
      const el = document.querySelector(href) as HTMLElement;
      if (el) {
        if (lenis) {
          lenis.scrollTo(el, {
            duration: shouldReduceMotion ? 0 : 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        } else {
          el.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
        }
      }
    } else {
      if (shouldReduceMotion) {
        window.location.href = href;
        return;
      }
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
  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' || e.key === '`') {
        const target = e.target instanceof HTMLElement ? e.target : null;
        if (!target?.closest('input, textarea, select, [contenteditable="true"]')) {
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
      if (shouldReduceMotion) {
        setSubtitleVisible(true);
        setSubtitleText(FULL_SUBTITLE);
        return;
      }

      const timer = setTimeout(() => {
        setSubtitleVisible(true);
        let charIndex = 0;
        const typeInterval = setInterval(() => {
          charIndex++;
          setSubtitleText(FULL_SUBTITLE.slice(0, charIndex));
          if (charIndex >= FULL_SUBTITLE.length) {
            clearInterval(typeInterval);
          }
        }, 35);
        return () => clearInterval(typeInterval);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [introInView, shouldReduceMotion, subtitleVisible]);

  return (
    <>
      {/* ═══════════════════════════════════════════════
          HERO — Full viewport, 3D logo only
          ═══════════════════════════════════════════════ */}
      <section 
        ref={heroRef}
        id="home" 
        className="relative flex h-screen min-h-[100svh] items-center justify-center overflow-hidden"
      >
        <h1 className="sr-only">Jesaias — creative developer building software, audio tools and playful systems</h1>
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute left-1/2 top-[44%] h-[62vw] max-h-[760px] min-h-[420px] w-[62vw] max-w-[760px] min-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4ddbff]/[0.035] blur-3xl" />
          <div className="absolute inset-x-[8vw] top-1/2 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          <div className="absolute bottom-[12vh] left-1/2 h-[32vh] w-px bg-gradient-to-b from-transparent via-[#4ddbff]/10 to-transparent" />
        </div>

        <div className="pointer-events-none absolute left-5 top-24 z-30 font-mono text-[9px] uppercase leading-5 tracking-[0.16em] text-white/30 sm:left-8 sm:text-[10px] md:left-12">
          <span className="block text-[#4ddbff]/70">Jesaias</span>
          Creative developer
        </div>

        <div className="pointer-events-none absolute right-5 top-24 z-30 text-right font-mono text-[9px] uppercase leading-5 tracking-[0.16em] text-white/30 sm:right-8 sm:text-[10px] md:right-12">
          <span className="block text-white/50">Copenhagen / DK</span>
          Software · Sound · Play
        </div>

        {/* 3D Logo — fills the hero without a fixed canvas layer, avoiding scroll compositor glitches */}
        <motion.div
          style={{
            opacity: logoOpacity,
            willChange: 'opacity',
          }}
          className="absolute inset-0 z-20 pointer-events-none"
        >
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94, filter: 'blur(10px)' }}
            animate={{
              opacity: 1,
              scale: isLogoHovered ? 1.012 : 1,
              filter: 'blur(0px)',
            }}
            transition={{ duration: 1.2, delay: shouldReduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Logo3D
              isActive={isLogoHovered}
              pulseToken={logoPulse}
              dragControls={logoDragControls}
              onDragControlsSync={syncLogoDragControls}
              onReady={handleLogoReady}
              playIntroSwirl={playLogoIntro && isLogoReady}
            />
          </motion.div>
        </motion.div>

        <button
          type="button"
          aria-label="Animate the Jesaias signature"
          data-testid="hero-logo-interaction"
          data-hide-cursor-dot
          data-hide-cursor-ring
          onPointerEnter={(event) => {
            if (event.pointerType !== 'touch') {
              setIsLogoHovered(true);
              setHeroCursorHidden(true);
            }
          }}
          onPointerLeave={() => {
            setIsLogoHovered(false);
            setHeroCursorHidden(false);
          }}
          onFocus={(event) => {
            if (event.currentTarget.matches(':focus-visible')) setIsLogoHovered(true);
          }}
          onBlur={() => {
            setIsLogoHovered(false);
            setHeroCursorHidden(false);
          }}
          onPointerDown={(event) => {
            if (shouldReduceMotion || event.button !== 0) return;

            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);
            setIsLogoHovered(true);
            setHeroCursorHidden(true);

            logoDragControls.current.isDragging = true;
            logoDragControls.current.spinVelocity = 0;
            logoDragStart.current = {
              pointerId: event.pointerId,
              x: event.clientX,
              y: event.clientY,
              rotationX: logoDragControls.current.rotationX,
              rotationY: logoDragControls.current.rotationY,
              lastX: event.clientX,
              lastTime: performance.now(),
              moved: false,
            };
          }}
          onClick={(event) => {
            if (logoDragStart.current.moved) {
              logoDragStart.current.moved = false;
              return;
            }
            if (event.detail > 0) event.currentTarget.blur();
            setLogoPulse((value) => value + 1);
          }}
          className="group absolute left-1/2 top-[44%] z-[25] h-[min(48vw,500px)] min-h-[220px] w-[min(72vw,720px)] -translate-x-1/2 -translate-y-1/2 touch-none cursor-grab rounded-[45%] bg-transparent focus-visible:outline-none active:cursor-grabbing max-sm:h-[240px] max-sm:w-[86vw]"
        >
          <span className="sr-only">The signature responds to pointer movement, dragging and clicks</span>
          <span aria-hidden="true" className="absolute left-[9%] top-[12%] h-3 w-3 border-l border-t border-[#4ddbff]/70 opacity-0 transition-opacity group-focus-visible:opacity-100" />
          <span aria-hidden="true" className="absolute right-[9%] top-[12%] h-3 w-3 border-r border-t border-[#4ddbff]/70 opacity-0 transition-opacity group-focus-visible:opacity-100" />
          <span aria-hidden="true" className="absolute bottom-[12%] left-[9%] h-3 w-3 border-b border-l border-[#4ddbff]/70 opacity-0 transition-opacity group-focus-visible:opacity-100" />
          <span aria-hidden="true" className="absolute bottom-[12%] right-[9%] h-3 w-3 border-b border-r border-[#4ddbff]/70 opacity-0 transition-opacity group-focus-visible:opacity-100" />
        </button>

        <AnimatePresence>
          {showBlueprint && !shouldReduceMotion ? <BlueprintReveal /> : null}
        </AnimatePresence>

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
              {subtitleVisible && <span className="cursor-blink ml-0.5">|</span>}
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
            Code, sound and playful systems—built with intent.
          </motion.p>

          {/* CTA Buttons — terminal commands */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={introInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 md:mt-14 relative z-40 pointer-events-auto"
          >
            <TerminalButton onClick={() => handleNavClick('#projects')} variant="outline">
              /projects
            </TerminalButton>
            <TerminalButton onClick={() => handleNavClick('#about')}>
              /about
            </TerminalButton>
            <TerminalButton onClick={() => handleNavClick('#contact')} variant="outline">
              /contact
            </TerminalButton>
          </motion.div>
          <button
            type="button"
            aria-label="Open root terminal"
            onClick={() => {
              play('click');
              setIsTerminalOpen(true);
            }}
            className="mt-6 min-h-7 px-2 font-mono text-[9px] lowercase tracking-[0.18em] text-[#4ddbff]/10 transition-colors hover:text-[#4ddbff]/45 focus-visible:text-[#4ddbff] focus-visible:outline-none"
          >
            root
          </button>
        </div>
      </section>

      <TerminalOverlay 
        isOpen={isTerminalOpen} 
        onClose={closeTerminal}
      />
    </>
  );
}

function BlueprintReveal() {
  const lineTransition = { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45 } }}
      className="pointer-events-none absolute left-1/2 top-[44%] z-30 h-[min(54vw,540px)] min-h-[260px] w-[min(80vw,800px)] -translate-x-1/2 -translate-y-1/2"
    >
      <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={lineTransition} className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-transparent via-[#4ddbff]/55 to-transparent" />
      <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ ...lineTransition, delay: 0.08 }} className="absolute inset-x-0 bottom-0 h-px origin-right bg-gradient-to-r from-transparent via-[#4ddbff]/30 to-transparent" />
      <motion.span initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ ...lineTransition, delay: 0.15 }} className="absolute inset-y-0 left-0 w-px origin-top bg-gradient-to-b from-transparent via-[#4ddbff]/35 to-transparent" />
      <motion.span initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ ...lineTransition, delay: 0.2 }} className="absolute inset-y-0 right-0 w-px origin-bottom bg-gradient-to-b from-transparent via-[#4ddbff]/35 to-transparent" />

      <motion.span
        initial={{ left: '10%', opacity: 0 }}
        animate={{ left: '90%', opacity: [0, 0.65, 0] }}
        transition={{ duration: 1.4, delay: 0.42, ease: 'easeInOut' }}
        className="absolute inset-y-[5%] w-px bg-[#b9f4ff] shadow-[0_0_18px_rgba(77,219,255,0.9)]"
      />

      <div className="absolute left-3 top-3 font-mono text-[8px] uppercase tracking-[0.2em] text-[#4ddbff]/55 sm:text-[9px]">
        mark / construction
      </div>
      <div className="absolute bottom-3 right-3 font-mono text-[8px] uppercase tracking-[0.2em] text-white/30 sm:text-[9px]">
        geometry locked
      </div>
      <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-[#4ddbff]/55" />
      <span className="absolute left-1/2 bottom-0 h-3 w-px -translate-x-1/2 translate-y-1/2 bg-[#4ddbff]/35" />
      <span className="absolute left-0 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-[#4ddbff]/35" />
      <span className="absolute right-0 top-1/2 h-px w-3 translate-x-1/2 -translate-y-1/2 bg-[#4ddbff]/35" />
    </motion.div>
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

  const classes = `
    group relative min-h-11 overflow-hidden px-8 py-3.5 font-mono text-sm tracking-wider transition-all duration-300
    ${variant === 'solid'
      ? 'border border-[#4ddbff]/40 bg-[#4ddbff]/10 text-[#4ddbff] hover:border-[#4ddbff]/80 hover:bg-[#4ddbff]/20'
      : 'border border-gray-700 bg-white/[0.02] text-gray-400 hover:border-[#4ddbff]/40 hover:bg-[#4ddbff]/5 hover:text-[#4ddbff]/80'
    }
  `;
  const style = {
    boxShadow: variant === 'solid'
      ? '0 0 20px rgba(77, 219, 255, 0.1), inset 0 1px 0 rgba(77, 219, 255, 0.1)'
      : 'inset 0 1px 0 rgba(255, 255, 255, 0.03)',
  };
  const decoration = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(77,219,255,0.08),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4ddbff]/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
      />
      <span className="relative z-10">{children}</span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        onMouseEnter={() => play('hover')}
        onClick={() => play('click')}
        className={classes}
        style={style}
      >
        {decoration}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      onMouseEnter={() => play('hover')}
      onClick={() => {
        play('click');
        onClick?.();
      }}
      className={classes}
      style={style}
    >
      {decoration}
    </motion.button>
  );
}
