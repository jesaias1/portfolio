'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import CustomCursor from '@/components/CustomCursor';
import ScrollProgress from '@/components/ScrollProgress';
import SplashScreen from '@/components/SplashScreen';
import GlitchFlash from '@/components/GlitchFlash';
import ScrollVideo from '@/components/ScrollVideo';
import SectionDivider from '@/components/SectionDivider';
import ServicesSection from '@/components/ServicesSection';
import StatsSection from '@/components/StatsSection';
import Image from 'next/image';

export default function Home() {
  const [showSplash, setShowSplash] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('jesaias-visited');
    if (!hasVisited) {
      setShowSplash(true);
    }
    setMounted(true);
  }, []);

  const handleSplashComplete = () => {
    localStorage.setItem('jesaias-visited', 'true');
    setShowSplash(false);
  };

  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showSplash]);

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      {(!showSplash && mounted) && (
          <main className="relative">
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
            <StatsSection />
            <SectionDivider />
            <About />
            <SectionDivider />
            <Contact />
            
            {/* Footer — premium terminal style */}
            <footer className="relative py-10 md:py-16 border-t border-white/5">
              {/* Top glow line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4ddbff]/30 to-transparent" />
              
              <div className="max-w-6xl mx-auto px-6">
                {/* Upper footer */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
                  {/* Branding */}
                  <div className="space-y-4">
                    <Image
                      src="/logo.png"
                      alt="Jesaias"
                      width={100}
                      height={35}
                      className="h-6 w-auto opacity-60"
                    />
                    <p className="font-mono text-xs text-gray-600 leading-relaxed max-w-xs">
                      Creative developer building digital experiences at the intersection of code, creativity, and design.
                    </p>
                  </div>

                  {/* Navigation */}
                  <div className="space-y-3">
                    <span className="font-mono text-[10px] text-[#4ddbff]/50 tracking-widest uppercase">Sitemap</span>
                    <div className="grid grid-cols-2 gap-2">
                      {['services', 'projects', 'about', 'contact'].map(item => (
                        <a
                          key={item}
                          href={`#${item}`}
                          className="font-mono text-xs text-gray-600 hover:text-[#4ddbff] transition-colors"
                        >
                          <span className="text-[#4ddbff]/30 mr-1">{'>'}</span>
                          {item}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Social & Status */}
                  <div className="space-y-3">
                    <span className="font-mono text-[10px] text-[#4ddbff]/50 tracking-widest uppercase">Connect</span>
                    <div className="flex flex-col gap-2">
                      <a
                        href="https://github.com/jesaias1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-gray-600 hover:text-[#4ddbff] transition-colors"
                      >
                        <span className="text-[#4ddbff]/30 mr-1">{'>'}</span>
                        github
                      </a>
                      <a
                        href="https://www.linkedin.com/in/jesaias/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-gray-600 hover:text-[#4ddbff] transition-colors"
                      >
                        <span className="text-[#4ddbff]/30 mr-1">{'>'}</span>
                        linkedin
                      </a>
                      <a
                        href="https://www.instagram.com/linasjesaias/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-gray-600 hover:text-[#4ddbff] transition-colors"
                      >
                        <span className="text-[#4ddbff]/30 mr-1">{'>'}</span>
                        instagram
                      </a>
                    </div>
                  </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/5 pt-6">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      {/* Heartbeat status dot */}
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ddbff] opacity-50" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ddbff]" />
                      </span>
                      <span className="font-mono text-[10px] text-gray-700 tracking-wider">
                        system_status: online
                      </span>
                    </div>

                    <span className="font-mono text-[10px] text-gray-700">
                      © {new Date().getFullYear()} jesaias.dk — all rights reserved
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="text-[#4ddbff]/15 font-mono text-[10px]">
                        process exited with code 0
                      </span>
                      <a 
                        href="/admin/login" 
                        className="opacity-15 hover:opacity-100 transition-opacity text-xs"
                      >
                        •
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </main>
      )}
    </>
  );
}
