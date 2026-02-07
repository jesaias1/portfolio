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
import StatsSection from '@/components/StatsSection';
import ServicesSection from '@/components/ServicesSection';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Prevent scroll during splash
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
            <CustomCursor />
            <ScrollProgress />
            <Navigation />
            <Hero />
            <About />
            <StatsSection />
            <Projects />
            <ServicesSection />
            <Contact />
            
            {/* Footer */}
            <footer className="py-12 border-t border-white/5">
              <div className="max-w-6xl mx-auto px-6">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <p>
                    © {new Date().getFullYear()} Alle rettigheder forbeholdes
                  </p>
                  <a 
                    href="/admin/login" 
                    className="opacity-20 hover:opacity-100 transition-opacity text-xs"
                  >
                    •
                  </a>
                </div>
              </div>
            </footer>
          </main>
        </SmoothScroll>
      )}
    </>
  );
}
