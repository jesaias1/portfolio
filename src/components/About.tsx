'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

const techStack = [
  { name: 'React / Next.js', level: 95, category: 'frontend' },
  { name: 'TypeScript', level: 88, category: 'language' },
  { name: 'Node.js', level: 85, category: 'backend' },
  { name: 'C++ / JUCE', level: 75, category: 'native' },
  { name: 'After Effects SDK', level: 80, category: 'creative' },
  { name: 'PostgreSQL', level: 80, category: 'database' },
  { name: 'WebSocket', level: 85, category: 'realtime' },
  { name: 'Framer Motion', level: 92, category: 'animation' },
];

export default function About() {
  const [aboutData, setAboutData] = useState({ content: '' });
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(data => setAboutData(data))
      .catch(console.error);
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-sm text-[#4ddbff]" style={{ textShadow: '0 0 8px rgba(77, 219, 255, 0.3)' }}>
              ~/about
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#4ddbff]/20 to-transparent" />
          </div>
          <h2 className="text-3xl md:text-6xl font-bold tracking-tight">
            System Info
          </h2>
        </motion.div>

        {/* Photo + Bio Hero */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-5 gap-8 md:gap-12 mb-16"
        >
          {/* Photo — left side */}
          <div className="md:col-span-2 flex justify-center md:justify-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Outer border frame */}
              <div className="absolute -inset-3 border border-[#4ddbff]/20 group-hover:border-[#4ddbff]/40 transition-all duration-700" />
              
              {/* Corner decorations */}
              <div className="absolute -top-3 -left-3 w-3 h-3 border-t border-l border-[#4ddbff]/60" />
              <div className="absolute -top-3 -right-3 w-3 h-3 border-t border-r border-[#4ddbff]/60" />
              <div className="absolute -bottom-3 -left-3 w-3 h-3 border-b border-l border-[#4ddbff]/60" />
              <div className="absolute -bottom-3 -right-3 w-3 h-3 border-b border-r border-[#4ddbff]/60" />

              {/* Photo */}
              <div className="relative w-64 h-80 md:w-72 md:h-96 overflow-hidden">
                <Image
                  src="/headshot.jpg"
                  alt="Jesaias"
                  fill
                  className="object-cover object-top grayscale group-hover:grayscale-[50%] transition-all duration-700"
                  sizes="(max-width: 768px) 256px, 288px"
                  priority
                />
                {/* Cyan overlay on hover */}
                <div className="absolute inset-0 bg-[#4ddbff]/5 group-hover:bg-[#4ddbff]/10 transition-all duration-700 mix-blend-overlay" />
                
                {/* Scanline effect */}
                <div className="absolute inset-0 scanlines pointer-events-none opacity-20" />
              </div>

              {/* Label below photo */}
              <div className="absolute -bottom-8 left-0 right-0 text-center">
                <span className="font-mono text-[10px] text-gray-700 tracking-widest">
                  capture_001.jpg
                </span>
              </div>
            </motion.div>
          </div>

          {/* System Info + Bio — right side */}
          <div className="md:col-span-3 space-y-6">
            {/* System diagnostics */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="border border-white/5 p-6 space-y-3 font-mono text-sm">
                <div className="text-[#4ddbff] text-xs tracking-wider mb-4" style={{ textShadow: '0 0 6px rgba(77, 219, 255, 0.3)' }}>
                  SYSTEM DIAGNOSTICS
                </div>
                
                <SystemLine label="USER" value="Jesaias (Linas)" />
                <SystemLine label="ROLE" value="Kreativ Udvikler" />
                <SystemLine label="LOCATION" value="Danmark 🇩🇰" />
                <SystemLine label="EXPERIENCE" value="2+ years" />
                <SystemLine label="STATUS" value="ONLINE" valueColor="#4ddbff" />
              </div>
            </motion.div>

            {/* Bio content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-gray-400 leading-relaxed space-y-4 font-sans text-base"
            >
              {aboutData.content ? (
                <div dangerouslySetInnerHTML={{ __html: aboutData.content }} />
              ) : (
                <>
                  <p>
                    Passioneret udvikler der bygger alt fra <span className="text-white">web apps</span> og{' '}
                    <span className="text-white">multiplayer spil</span> til{' '}
                    <span className="text-white">VST plugins</span> og{' '}
                    <span className="text-white">After Effects extensions</span>.
                  </p>
                  <p>
                    Min mission er at transformere komplekse idéer til 
                    brugervenlige, smukke og skalerbare løsninger der
                    overskrider det forventede.
                  </p>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="border border-white/5 p-6">
            <div className="text-[#4ddbff] text-xs tracking-wider mb-6 font-mono" style={{ textShadow: '0 0 6px rgba(77, 219, 255, 0.3)' }}>
              TECH STACK ANALYSIS
            </div>
            
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
              {techStack.map((tech, index) => (
                <TerminalSkillBar 
                  key={tech.name} 
                  tech={tech} 
                  index={index}
                  animate={isInView}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SystemLine({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-gray-600">{label}:</span>
      <span className="text-gray-300" style={valueColor ? { color: valueColor, textShadow: `0 0 8px ${valueColor}40` } : {}}>
        {value}
      </span>
    </div>
  );
}

function TerminalSkillBar({ tech, index, animate }: { tech: typeof techStack[0]; index: number; animate: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={animate ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="font-mono text-xs"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-300">{tech.name}</span>
        <span className="text-[#4ddbff]/70">{tech.level}%</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[#4ddbff]/40">[</span>
        <div className="flex-1 relative h-2 bg-white/5 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#4ddbff]/60 to-[#99eaff]/40"
            initial={{ width: '0%' }}
            animate={animate ? { width: `${tech.level}%` } : {}}
            transition={{ duration: 1, delay: index * 0.08 + 0.3, ease: [0.6, 0, 0.2, 1] }}
          />
        </div>
        <span className="text-[#4ddbff]/40">]</span>
      </div>
    </motion.div>
  );
}
