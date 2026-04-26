'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import RevealText from './RevealText';

const services = [
  {
    icon: '{}',
    title: 'Web Applications',
    command: './build --webapp',
    description: 'Full-stack web apps with modern technologies',
    features: ['React & Next.js', 'Node.js Backend', 'Database Design', 'API Integration'],
  },
  {
    icon: '⚡',
    title: 'Real-time Systems',
    command: './build --realtime',
    description: 'Multiplayer games and real-time applications',
    features: ['WebSocket', 'Real-time Sync', 'Leaderboards', 'Cross-platform'],
  },
  {
    icon: '⚙',
    title: 'Software Engineering',
    command: './build --software',
    description: 'Scalable backend systems and cloud infrastructure',
    features: ['Python / Node.js', 'REST & GraphQL APIs', 'CI/CD Pipelines', 'System Architecture'],
  },
  {
    icon: '◆',
    title: 'Creative Tools',
    command: './build --creative',
    description: 'Extensions and tools for creative workflows',
    features: ['After Effects SDK', 'Automation', 'UI/UX Design', 'Motion Graphics'],
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} id="services" className="py-32 relative">
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
              ~/services
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#4ddbff]/20 to-transparent" />
          </div>
          <h2 className="text-3xl md:text-6xl font-bold tracking-tight mb-3">
            <RevealText text="Services" delay={0.1} />
          </h2>
          <p className="text-gray-500 font-mono text-sm">
            {'>'} cat services.json --format=detailed
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative border border-white/5 hover:border-[#4ddbff]/30 transition-all duration-500 bg-[#0c0c0c]/50 group-hover:shadow-[0_0_30px_rgba(77,219,255,0.05)]">
                {/* Top glow line on hover */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4ddbff]/0 group-hover:via-[#4ddbff]/40 to-transparent transition-all duration-700" />
                
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#4ddbff]/0 group-hover:border-[#4ddbff]/30 transition-all duration-500" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#4ddbff]/0 group-hover:border-[#4ddbff]/30 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#4ddbff]/0 group-hover:border-[#4ddbff]/30 transition-all duration-500" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#4ddbff]/0 group-hover:border-[#4ddbff]/30 transition-all duration-500" />

                {/* Card header — terminal style */}
                <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-[#111]/80">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff5f56]/60" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffbd2e]/60" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#27c93f]/60" />
                  </div>
                  <span className="font-mono text-[10px] text-gray-600 ml-1 group-hover:text-[#4ddbff]/50 transition-colors duration-500">
                    {service.command}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-2xl text-[#4ddbff]/60 font-mono mt-1 group-hover:text-[#4ddbff] transition-colors duration-500" style={{ textShadow: '0 0 10px rgba(77, 219, 255, 0.4)' }}>
                      {service.icon}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight group-hover:text-[#4ddbff] transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Features as terminal output */}
                  <div className="space-y-1.5 mt-4 font-mono text-xs">
                    {service.features.map((feature, i) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: index * 0.1 + i * 0.05 + 0.3 }}
                        className="flex items-center gap-2 text-gray-500 group-hover:text-gray-400 transition-colors"
                      >
                        <span className="text-[#4ddbff]/50">▸</span>
                        {feature}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
