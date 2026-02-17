'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

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

        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          {/* Left: Bio as system info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* System diagnostics style */}
            <div className="space-y-4 font-mono text-sm">
              <div className="border border-white/5 p-6 space-y-3">
                <div className="text-[#4ddbff] text-xs tracking-wider mb-4" style={{ textShadow: '0 0 6px rgba(77, 219, 255, 0.3)' }}>
                  SYSTEM DIAGNOSTICS
                </div>
                
                <SystemLine label="USER" value="Jesaias (Linas)" />
                <SystemLine label="ROLE" value="Kreativ Udvikler" />
                <SystemLine label="LOCATION" value="Danmark 🇩🇰" />
                <SystemLine label="EXPERIENCE" value="2+ years" />
                <SystemLine label="STATUS" value="ONLINE" valueColor="#4ddbff" />
              </div>

              {/* Bio content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
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

          {/* Right: Tech stack as terminal readout */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="border border-white/5 p-6">
              <div className="text-[#4ddbff] text-xs tracking-wider mb-6 font-mono" style={{ textShadow: '0 0 6px rgba(77, 219, 255, 0.3)' }}>
                TECH STACK ANALYSIS
              </div>
              
              <div className="space-y-4">
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
  const barLength = 20;
  const filled = Math.round((tech.level / 100) * barLength);
  const empty = barLength - filled;
  
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
