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
            <Projects />
            <About />
            <Contact />
            
            {/* Footer — terminal style */}
            <footer className="py-8 border-t border-white/5">
              <div className="max-w-6xl mx-auto px-6">
                <div className="flex justify-between items-center font-mono text-xs text-gray-700">
                  <p>
                    © {new Date().getFullYear()} jesaias.dev
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-[#00ff41]/30">process exited with code 0</span>
                    <a 
                      href="/admin/login" 
                      className="opacity-20 hover:opacity-100 transition-opacity"
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
