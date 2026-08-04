'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';
import ScrollVideo from '@/components/ScrollVideo';
import SectionDivider from '@/components/SectionDivider';
import SplashScreen from '@/components/SplashScreen';

const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false });
const GlitchFlash = dynamic(() => import('@/components/GlitchFlash'), { ssr: false });
const ScrollProgress = dynamic(() => import('@/components/ScrollProgress'), { ssr: false });
const ServicesSection = dynamic(() => import('@/components/ServicesSection'));
const Projects = dynamic(() => import('@/components/Projects'));
const About = dynamic(() => import('@/components/About'));
const Contact = dynamic(() => import('@/components/Contact'));

const sitemap = ['services', 'projects', 'about', 'contact'];

const socialLinks = [
  { label: 'github', href: 'https://github.com/jesaias1' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/jesaias/' },
  { label: 'instagram', href: 'https://www.instagram.com/linasjesaias/' },
];

export default function Home() {
  const [showSplash, setShowSplash] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setShowSplash(!reducedMotion && !window.localStorage.getItem('jesaias-visited'));
      setIsReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showSplash ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showSplash]);

  const completeSplash = () => {
    window.localStorage.setItem('jesaias-visited', 'true');
    setShowSplash(false);
  };

  return (
    <>
      {!showSplash && isReady ? (
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
      ) : null}
      {showSplash && <SplashScreen onComplete={completeSplash} />}

      {!showSplash && isReady && (
        <main id="main-content" className="relative" tabIndex={-1}>
          <ScrollVideo />
          <CustomCursor />
          <ScrollProgress />
          <GlitchFlash />
          <Navigation />
          <Hero />

          <SectionDivider />
          <ServicesSection />
          <SectionDivider />
          <Projects />
          <SectionDivider />
          <About />
          <SectionDivider />
          <Contact />

          <Footer />
        </main>
      )}
    </>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-10 md:py-16">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4ddbff]/30 to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 grid grid-cols-1 gap-8 md:mb-12 md:grid-cols-3 md:gap-12">
          <div className="space-y-4">
            <Image
              src="/logo.png"
              alt="Jesaias"
              width={100}
              height={35}
              className="h-6 w-auto opacity-60"
            />
            <p className="max-w-xs font-mono text-xs leading-relaxed text-gray-600">
              Creative developer building digital experiences at the intersection of code,
              creativity, and design.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#4ddbff]/50">
              Sitemap
            </span>
            <div className="grid grid-cols-2 gap-2">
              {sitemap.map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className="inline-flex min-h-11 items-center font-mono text-xs text-gray-600 transition-colors hover:text-[#4ddbff]"
                >
                  <span className="mr-1 text-[#4ddbff]/30">&gt;</span>
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#4ddbff]/50">
              Connect
            </span>
            <div className="flex flex-col gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center font-mono text-xs text-gray-600 transition-colors hover:text-[#4ddbff]"
                >
                  <span className="mr-1 text-[#4ddbff]/30">&gt;</span>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ddbff] opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ddbff]" />
              </span>
              <span className="font-mono text-[10px] tracking-wider text-gray-700">
                system_status: online
              </span>
            </div>

            <span className="font-mono text-[10px] text-gray-700">
              (c) {new Date().getFullYear()} jesaias.dk - all rights reserved
            </span>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-[#4ddbff]/15">
                process exited with code 0
              </span>
              <a
                href="/admin/login"
                aria-label="Open portfolio editor"
                className="inline-flex min-h-11 min-w-11 items-center justify-center text-xs opacity-15 transition-opacity hover:opacity-100"
              >
                .
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
