'use client';

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import RevealText from './RevealText';

interface Stat {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  icon: string;
}

const stats: Stat[] = [
  { value: 3, label: 'Live Produkter', suffix: '+', icon: '◎' },
  { value: 964, label: 'Aktive Brugere', icon: '⟐' },
  { value: 99, label: 'Kundetilfredshed', suffix: '%', icon: '★' },
  { value: 7, label: 'År Erfaring', suffix: '+', icon: '⏱' },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Terminal-style header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block border border-white/5 bg-[#0c0c0c] px-6 py-2 mb-6">
            <span className="font-mono text-xs text-[#4ddbff]" style={{ textShadow: '0 0 6px rgba(77, 219, 255, 0.3)' }}>
              {'>'} system_stats --live
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            <RevealText text="Resultater" delay={0.1} />
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, index, isInView }: { stat: Stat; index: number; isInView: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(stat.value);
    }
  }, [isInView, stat.value, motionValue]);

  useEffect(() => {
    springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = `${stat.prefix || ''}${Math.floor(latest)}${stat.suffix || ''}`;
      }
    });
  }, [springValue, stat]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border border-white/5 hover:border-[#4ddbff]/20 bg-[#0c0c0c]/50 p-6 text-center group transition-all duration-500"
    >
      {/* Icon */}
      <div className="text-2xl text-[#4ddbff]/60 mb-3 font-mono group-hover:text-[#4ddbff] transition-colors" style={{ textShadow: '0 0 8px rgba(77, 219, 255, 0.2)' }}>
        {stat.icon}
      </div>

      {/* Animated number */}
      <div
        ref={ref}
        className="text-3xl md:text-4xl font-bold font-mono text-[#4ddbff] mb-2"
        style={{ textShadow: '0 0 15px rgba(77, 219, 255, 0.3)' }}
      >
        0
      </div>

      {/* Label */}
      <p className="text-xs font-mono tracking-widest text-gray-600 group-hover:text-gray-400 transition-colors">
        {stat.label.toUpperCase()}
      </p>

      {/* Animated bar */}
      <div className="w-full h-px mt-4 bg-white/5 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#4ddbff]/40 to-[#99eaff]/20"
          initial={{ width: '0%' }}
          animate={isInView ? { width: '100%' } : {}}
          transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
        />
      </div>
    </motion.div>
  );
}
