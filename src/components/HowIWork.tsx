'use client';

import { motion } from 'framer-motion';

const workflowSteps = [
  {
    eyebrow: '01 / Direction',
    title: 'Shape the idea before the build gets noisy.',
    body: 'I clarify the product, audience, visual direction and first useful version so the work has a strong target from the beginning.',
  },
  {
    eyebrow: '02 / Prototype',
    title: 'Move quickly into something real.',
    body: 'I use React, Next.js, TypeScript, Tailwind and AI-assisted coding workflows to turn concepts into working prototypes fast.',
  },
  {
    eyebrow: '03 / Test',
    title: 'Debug the feel, not only the code.',
    body: 'I test flows, interaction timing, edge cases and mobile behavior, then use AI-assisted debugging and iteration to tighten the product.',
  },
  {
    eyebrow: '04 / Polish',
    title: 'Refine until it feels ready to show.',
    body: 'I care about visual quality, copy, motion, responsive details and the small product decisions that make a demo feel credible.',
  },
];

const fitRows = [
  ['Best fit', 'creative frontend roles, product prototypes, interactive tools, music software ideas'],
  ['Workflow', 'creative direction, AI-assisted implementation, debugging, testing and fast iteration'],
  ['Tools', 'React, Next.js, TypeScript, Tailwind, Framer Motion, real-time web concepts'],
  ['Currently deepening', 'JavaScript fundamentals, React patterns, TypeScript architecture, JUCE/C++ and APIs'],
];

export default function HowIWork() {
  return (
    <section id="process" className="content-section relative py-16 md:py-24">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6">
        <motion.header
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-8 grid gap-5 border-b border-white/[0.08] pb-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end"
        >
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#4ddbff]">
                Process
              </span>
              <span className="h-px w-10 bg-[#4ddbff]/30" />
            </div>
            <h2 className="text-3xl font-bold tracking-[-0.04em] text-white md:text-5xl">
              From idea to working product.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-gray-500 lg:justify-self-end lg:text-right">
            My strongest work is the loop between creative direction, product thinking, AI-assisted implementation and practical testing.
          </p>
        </motion.header>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid border-l border-t border-white/[0.08] sm:grid-cols-2">
            {workflowSteps.map((step, index) => (
              <motion.article
                key={step.eyebrow}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: index * 0.05 }}
                viewport={{ once: true, margin: '-60px' }}
                className="min-h-[230px] border-b border-r border-white/[0.08] bg-[#0a0b0c]/55 p-5 sm:p-6"
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#4ddbff]/55">
                  {step.eyebrow}
                </span>
                <h3 className="mt-8 max-w-sm text-xl font-semibold tracking-[-0.03em] text-white">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-gray-500">
                  {step.body}
                </p>
              </motion.article>
            ))}
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            viewport={{ once: true, margin: '-60px' }}
            className="border border-[#4ddbff]/15 bg-[#071012]/70 p-5 shadow-[0_0_55px_rgba(77,219,255,0.04)] sm:p-6"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#4ddbff]">
              Work signal
            </span>
            <h3 className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-white">
              Honest, fast-moving product building.
            </h3>
            <p className="mt-4 text-sm leading-6 text-gray-500">
              I do not position myself as a traditional senior engineer. I position myself as a creative technical builder who can direct, prototype, implement, debug and refine ambitious web and music software ideas.
            </p>

            <dl className="mt-7 divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {fitRows.map(([label, value]) => (
                <div key={label} className="grid gap-2 py-4 md:grid-cols-[120px_1fr]">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#4ddbff]/60">
                    {label}
                  </dt>
                  <dd className="text-sm leading-6 text-gray-400">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
