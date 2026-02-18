'use client';

import { useState, useEffect } from 'react';
import { useSound } from '@/hooks/use-sound';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { useLenis } from 'lenis/react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lenis = useLenis();

  const { play } = useSound();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'services', href: '#services' },
    { name: 'projekter', href: '#projects' },
    { name: 'om', href: '#about' },
    { name: 'kontakt', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    play('click');
    setIsMobileMenuOpen(false);
    
    // Trigger Glitch
    window.dispatchEvent(new CustomEvent('glitch-trigger'));

    // Wait for cover (400ms) then scroll
    setTimeout(() => {
      if (lenis && href.startsWith('#')) {
        lenis.scrollTo(href, {
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    }, 400);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#4ddbff]/15'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div whileHover={{ opacity: 0.7 }}>
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#top');
              }}
              className="font-mono text-sm text-[#4ddbff] tracking-wider hover:text-white transition-colors"
              style={{ textShadow: '0 0 10px rgba(77, 219, 255, 0.3)' }}
            >
              {'>'} jesaias.dk
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <button
                  onClick={() => handleNavClick(item.href)}
                  onMouseEnter={() => play('hover')}
                  className="font-mono text-xs text-gray-500 hover:text-[#4ddbff] transition-colors relative group tracking-wider"
                >
                  <span className="text-[#4ddbff] opacity-0 group-hover:opacity-100 transition-opacity mr-1">{'>'}</span>
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#4ddbff] transition-all group-hover:w-full opacity-50" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen); play('click'); }}
            className="md:hidden text-xl text-gray-400 hover:text-[#4ddbff] transition-colors"
          >
            {isMobileMenuOpen ? <HiX /> : <HiMenu />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-[rgba(77,219,255,0.08)]"
          >
            <div className="px-6 py-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className="block w-full text-left font-mono text-sm text-gray-400 hover:text-[#4ddbff] transition-colors py-2"
                  >
                    <span className="text-[#4ddbff] mr-2">{'>'}</span>
                    {item.name}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
