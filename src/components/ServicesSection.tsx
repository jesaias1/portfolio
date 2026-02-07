'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { HiCode, HiLightningBolt, HiSparkles, HiCube } from 'react-icons/hi';

const services = [
  {
    icon: HiCode,
    title: 'Web Applikationer',
    description: 'Full-stack web apps med moderne teknologier',
    features: ['React & Next.js', 'Node.js Backend', 'Database Design', 'API Integration'],
    color: 'from-purple-500 to-indigo-500',
  },
  {
    icon: HiLightningBolt,
    title: 'Multiplayer Spil',
    description: 'Real-time spil med server arkitektur',
    features: ['WebSocket', 'Real-time Sync', 'Leaderboards', 'Cross-platform'],
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: HiSparkles,
    title: 'UI/UX Design',
    description: 'Brugervenlige og smukke interfaces',
    features: ['Figma Design', 'Animationer', 'Responsivt', 'Accessibility'],
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: HiCube,
    title: '3D & Interaktivitet',
    description: 'Imponerende visuelle oplevelser',
    features: ['Three.js', 'WebGL', 'Scroll Animations', 'Micro-interactions'],
    color: 'from-orange-500 to-yellow-500',
  },
];

export default function ServicesSection() {
  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-display font-light mb-6">
            Hvad Jeg Tilbyder
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Fra idé til lancering - jeg hjælper dig hele vejen
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative h-96 perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card p-8 h-full flex flex-col items-center justify-center text-center group cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`w-20 h-20 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center mb-6`}
            >
              <service.icon className="text-4xl text-white" />
            </motion.div>

            <h3 className="text-2xl font-display font-light mb-4 group-hover:text-purple-400 transition-colors">
              {service.title}
            </h3>

            <p className="text-gray-400 text-sm">
              {service.description}
            </p>

            <motion.div
              className="mt-6 text-xs text-purple-400 tracking-wider"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              HOVER FOR DETALJER
            </motion.div>
          </motion.div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className={`glass-card p-8 h-full flex flex-col justify-between bg-gradient-to-br ${service.color} bg-opacity-10`}>
            <div>
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <ul className="space-y-3">
                {service.features.map((feature, i) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isFlipped ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="text-purple-400">✓</span>
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 bg-white text-black font-medium text-sm tracking-wider mt-4"
            >
              LÆR MERE
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
