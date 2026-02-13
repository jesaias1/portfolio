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
import SmoothScroll from '@/components/SmoothScroll';
import CosmicBackground from '@/components/CosmicBackground';
import SectionDivider from '@/components/SectionDivider';
import Image from 'next/image';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showSplash]);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      {!showSplash && (
        <SmoothScroll>
          <main className="relative">
            <CosmicBackground />
            <CustomCursor />
            <ScrollProgress />
            <Navigation />
            <Hero />
            <SectionDivider />
            <Projects />
            <SectionDivider />
            <About />
            <SectionDivider />
            <Contact />
            
            {/* Footer — terminal style */}
            <footer className="py-12 border-t border-white/5">
              <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  {/* Logo + copyright */}
                  <div className="flex items-center gap-4">
                    <Image
                      src="/logo.png"
                      alt="Jesaias"
                      width={80}
                      height={28}
                      className="h-5 w-auto opacity-40"
                    />
                    <span className="font-mono text-xs text-gray-700">
                      © {new Date().getFullYear()} jesaias.dk
                    </span>
                  </div>

                  {/* Social links */}
                  <div className="flex items-center gap-6">
                    <a
                      href="https://github.com/jesaias1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-gray-600 hover:text-[#00ff41] transition-colors"
                    >
                      github
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-gray-600 hover:text-[#00ff41] transition-colors"
                    >
                      linkedin
                    </a>
                    <span className="text-[#00ff41]/20 font-mono text-[10px]">
                      process exited with code 0
                    </span>
                    <a 
                      href="/admin/login" 
                      className="opacity-20 hover:opacity-100 transition-opacity text-xs"
                    >
                      •
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </main>
        </SmoothScroll>
      )}
    </>
  );
}
