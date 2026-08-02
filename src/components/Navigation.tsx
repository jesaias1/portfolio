'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { useSound } from '@/hooks/use-sound';

const navItems = [
  { name: 'services', href: '#services', section: 'services' },
  { name: 'projects', href: '#projects', section: 'projects' },
  { name: 'music software', href: '/audio', section: null },
  { name: 'about', href: '#about', section: 'about' },
  { name: 'contact', href: '#contact', section: 'contact' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const lenis = useLenis();
  const { play } = useSound();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = ['home', 'services', 'projects', 'about', 'contact'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: '-28% 0px -58% 0px', threshold: [0, 0.2, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const handleNavClick = (href: string) => {
    play('click');
    setIsMobileMenuOpen(false);

    if (href.startsWith('#')) {
      const element = document.querySelector(href) as HTMLElement | null;
      if (!element) return;
      setActiveSection(element.id);
      if (lenis) {
        lenis.scrollTo(element, {
          duration: 1.25,
          easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
        });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      window.history.replaceState(null, '', href);
      return;
    }

    window.dispatchEvent(new CustomEvent('glitch-trigger'));
    window.setTimeout(() => window.location.assign(href), 400);
  };

  return (
    <motion.nav
      aria-label="Primary navigation"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 ${
        isScrolled
          ? 'border-b border-[#4ddbff]/10 bg-[#0a0a0a]/85 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 py-3">
        <div className="flex items-center justify-between">
          <motion.div whileHover={{ opacity: 0.7 }}>
            <Link
              href="/#home"
              onClick={(event) => {
                event.preventDefault();
                handleNavClick('#home');
              }}
              aria-label="Back to the top"
              className="font-mono text-sm tracking-wider text-[#4ddbff] transition-colors hover:text-white"
              style={{ textShadow: '0 0 10px rgba(77, 219, 255, 0.3)' }}
            >
              {'>'} jesaias.dk
            </Link>
          </motion.div>

          <div className="hidden items-center space-x-8 md:flex">
            {navItems.map((item, index) => {
              const isActive = item.section === activeSection;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <a
                    href={item.href}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavClick(item.href);
                    }}
                    onMouseEnter={() => play('hover')}
                    aria-current={isActive ? 'location' : undefined}
                    className={`group relative font-mono text-xs tracking-wider transition-colors ${
                      isActive ? 'text-[#4ddbff]' : 'text-gray-500 hover:text-[#4ddbff]'
                    }`}
                  >
                    <span className={`mr-1 text-[#4ddbff] transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      {'>'}
                    </span>
                    {item.name}
                    <span className={`absolute -bottom-1 left-0 h-px bg-[#4ddbff] opacity-50 transition-all ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </a>
                </motion.div>
              );
            })}
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsMobileMenuOpen((open) => !open);
              play('click');
            }}
            className="text-xl text-gray-400 transition-colors hover:text-[#4ddbff] md:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isMobileMenuOpen ? <HiX /> : <HiMenu />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-[rgba(77,219,255,0.08)] bg-[#0a0a0a]/95 backdrop-blur-xl md:hidden"
          >
            <div className="space-y-3 px-6 py-5">
              {navItems.map((item, index) => {
                const isActive = item.section === activeSection;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <a
                      href={item.href}
                      onClick={(event) => {
                        event.preventDefault();
                        handleNavClick(item.href);
                      }}
                      aria-current={isActive ? 'location' : undefined}
                      className={`block w-full py-2 text-left font-mono text-sm transition-colors ${
                        isActive ? 'text-[#4ddbff]' : 'text-gray-400 hover:text-[#4ddbff]'
                      }`}
                    >
                      <span className="mr-2 text-[#4ddbff]">{'>'}</span>
                      {item.name}
                    </a>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.nav>
  );
}
