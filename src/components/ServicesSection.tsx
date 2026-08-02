'use client';

import { motion } from 'framer-motion';

const services = [
  {
    title: 'Web products',
    description: 'Polished full-stack applications built around a clear idea and real users.',
    capabilities: ['Next.js', 'APIs', 'Databases'],
  },
  {
    title: 'Interactive systems',
    description: 'Games and real-time experiences where feedback, timing and flow matter.',
    capabilities: ['Realtime', 'Multiplayer', 'PWA'],
  },
  {
    title: 'Audio software',
    description: 'Creative instruments and music tools that make technical workflows feel playable.',
    capabilities: ['C++', 'JUCE', 'VST3'],
  },
  {
    title: 'Product engineering',
    description: 'From rough concept to a reliable system with thoughtful interaction design.',
    capabilities: ['Architecture', 'UX', 'Delivery'],
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="content-section relative py-16 md:py-20">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6">
        <motion.header
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-8 grid gap-4 border-b border-white/[0.08] pb-6 md:grid-cols-[1fr_auto] md:items-end"
        >
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#4ddbff]">
                What I build
              </span>
              <span className="h-px w-10 bg-[#4ddbff]/30" />
            </div>
            <h2 className="text-3xl font-bold tracking-[-0.04em] text-white md:text-5xl">
              Creative ideas, engineered properly.
            </h2>
          </div>
          <p className="max-w-sm font-mono text-[10px] leading-5 text-gray-600 md:text-right">
            From first interaction to the system underneath it.
          </p>
        </motion.header>

        <div className="grid grid-cols-2 border-l border-t border-white/[0.08] lg:grid-cols-4">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
              viewport={{ once: true, margin: '-60px' }}
              className="group min-h-[220px] border-b border-r border-white/[0.08] bg-[#0a0b0c]/55 p-4 transition-colors hover:bg-[#4ddbff]/[0.035] sm:p-5 md:min-h-[240px] md:p-6"
            >
              <span className="font-mono text-[9px] tracking-[0.14em] text-[#4ddbff]/55">
                /{String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-7 text-lg font-semibold tracking-[-0.025em] text-white transition-colors group-hover:text-[#4ddbff] sm:text-xl">
                {service.title}
              </h3>
              <p className="mt-3 text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">
                {service.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5">
                {service.capabilities.map((capability) => (
                  <span key={capability} className="font-mono text-[8px] uppercase tracking-[0.1em] text-gray-700 sm:text-[9px]">
                    {capability}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
