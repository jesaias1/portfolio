'use client';

import { motion } from 'framer-motion';

const buildLogItems = [
  {
    date: 'Now',
    title: 'ORVO preview build',
    body: 'Installer and product page are being shaped into a clearer preview for producers, with the mockup carrying the visual story more than the AI teaser video.',
  },
  {
    date: 'Next',
    title: 'MIDIUM case study',
    body: 'Preparing a demo-ready walkthrough for the visual MIDI concept, focused on drawing ideas and moving from gesture to musical output.',
  },
  {
    date: 'Active',
    title: 'Presentation mode',
    body: 'The portfolio can run like a phone app for in-person demos, replaying the intro and opening in a cleaner standalone experience.',
  },
  {
    date: 'Ongoing',
    title: 'Media pass',
    body: 'Kvizy and ORVO teaser videos are being added carefully, with smaller motion previews and larger still mockups to keep the design premium.',
  },
];

export default function BuildLog() {
  return (
    <section id="build-log" className="content-section relative py-16 md:py-24">
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6">
        <motion.header
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-8 grid gap-5 border-b border-white/[0.08] pb-6 md:grid-cols-[1fr_auto] md:items-end"
        >
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#4ddbff]">
                Build log
              </span>
              <span className="h-px w-10 bg-[#4ddbff]/30" />
            </div>
            <h2 className="text-3xl font-bold tracking-[-0.04em] text-white md:text-5xl">
              What is moving right now.
            </h2>
          </div>
          <p className="max-w-sm font-mono text-[10px] leading-5 text-gray-600 md:text-right">
            Current work, demos and product direction without pretending every idea is already shipped.
          </p>
        </motion.header>

        <div className="border-l border-t border-white/[0.08]">
          {buildLogItems.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.04 }}
              viewport={{ once: true, margin: '-60px' }}
              className="grid gap-4 border-b border-r border-white/[0.08] bg-[#08090a]/55 p-5 md:grid-cols-[120px_1fr] md:p-6"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#4ddbff]/60">
                {item.date}
              </span>
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-white">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-500">
                  {item.body}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
