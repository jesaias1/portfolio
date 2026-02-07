'use client';

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface Stat {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

const stats: Stat[] = [
  { value: 3, label: 'Live Produkter', suffix: '+' },
  { value: 1000, label: 'Aktive Brugere', suffix: '+' },
  { value: 99, label: 'Kundetilfredshed', suffix: '%' },
  { value: 2, label: 'År Erfaring', suffix: '+' },
];

export default function StatsSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-display font-light mb-6">
            Resultater Der Taler
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Tal fortæller historien bedre end ord
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <div className="glass-card p-8 md:p-12 relative">
            <motion.div
              className="absolute -top-6 -left-6 text-8xl text-purple-500/20 font-serif"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              viewport={{ once: true }}
            >
              "
            </motion.div>
            
            <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed mb-6 italic">
              Linas leverede en fantastisk hjemmeside der overgik alle mine forventninger. 
              Hans tekniske kunnen kombineret med kreativ vision er uovertruffen.
            </p>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
              <div>
                <p className="font-medium">Maria Hansen</p>
                <p className="text-sm text-gray-400">CEO, TechStart ApS</p>
              </div>
            </div>

            {/* Stars */}
            <div className="flex gap-1 mt-6">
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1, type: 'spring' }}
                  viewport={{ once: true }}
                  className="text-2xl text-yellow-400"
                >
                  ⭐
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
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
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: 'spring',
        stiffness: 200,
      }}
      viewport={{ once: true }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)',
      }}
      className="glass-card p-8 text-center group"
    >
      <motion.div
        ref={ref}
        className="text-5xl md:text-6xl font-display font-light mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
      >
        0
      </motion.div>
      
      <p className="text-sm tracking-widest text-gray-400 group-hover:text-gray-300 transition-colors">
        {stat.label.toUpperCase()}
      </p>

      {/* Animated circle */}
      <motion.div
        className="w-full h-1 mt-4 bg-white/5 rounded-full overflow-hidden"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ width: '0%' }}
          whileInView={{ width: '100%' }}
          transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
          viewport={{ once: true }}
        />
      </motion.div>
    </motion.div>
  );
}
