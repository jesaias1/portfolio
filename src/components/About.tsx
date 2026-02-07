'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { HiCode, HiLightningBolt, HiSparkles } from 'react-icons/hi';

const techStack = [
  { name: 'React', level: 95 },
  { name: 'Next.js', level: 90 },
  { name: 'TypeScript', level: 88 },
  { name: 'Node.js', level: 85 },
  { name: 'Tailwind', level: 92 },
  { name: 'Framer Motion', level: 90 },
  { name: 'PostgreSQL', level: 80 },
  { name: 'WebSocket', level: 85 },
];

export default function About() {
  const [aboutData, setAboutData] = useState({ content: '' });
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(data => setAboutData(data))
      .catch(console.error);
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-32 relative overflow-hidden">
      {/* Parallax background elements */}
      <motion.div 
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
          y,
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className="overflow-hidden mb-8"
            >
              <h2 className="text-5xl md:text-7xl font-display font-light tracking-tight">
                Om Mig
              </h2>
            </motion.div>

            <motion.div 
              className="w-24 h-px bg-gradient-to-r from-purple-500 to-pink-500 mb-8"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              style={{ transformOrigin: 'left' }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6 text-lg text-gray-300 leading-relaxed"
            >
              {aboutData.content ? (
                <div dangerouslySetInnerHTML={{ __html: aboutData.content }} />
              ) : (
                <>
                  <p>
                    Hej! Jeg er Linas, en passioneret udvikler der elsker at skabe 
                    digitale oplevelser der både ser fantastiske ud og fungerer perfekt.
                  </p>
                  <p>
                    Med over 2+ års erfaring inden for web udvikling har jeg hjulpet 
                    brands og virksomheder med at realisere deres digitale visioner gennem 
                    moderne teknologi og kreativt design.
                  </p>
                  <p>
                    Min mission er at transformere komplekse idéer til brugervenlige, 
                    smukke og skalerbare løsninger.
                  </p>
                </>
              )}
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-4 mt-12"
            >
              {[
                { icon: HiCode, text: 'Clean Code' },
                { icon: HiLightningBolt, text: 'Fast Delivery' },
                { icon: HiSparkles, text: 'Pixel Perfect' },
              ].map((item, i) => (
                <motion.div
                  key={item.text}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex flex-col items-center text-center p-4 glass-card cursor-default"
                >
                  <item.icon className="text-3xl text-purple-400 mb-2" />
                  <span className="text-xs text-gray-400">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Tech stack */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-display font-light mb-8">Tech Stack</h3>
            
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{tech.name}</span>
                  <span className="text-purple-400">{tech.level}%</span>
                </div>
                
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative overflow-hidden"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${tech.level}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    {/* Animated shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                        ease: 'linear',
                      }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
