'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { HiExternalLink, HiCode, HiX } from 'react-icons/hi';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
  featured: boolean;
  longDesc?: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(console.error);
  }, []);

  return (
    <>
      <section ref={sectionRef} id="projects" className="py-32 relative overflow-hidden">
        {/* Animated number background */}
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 text-[20rem] font-display font-light text-white/[0.02] select-none pointer-events-none"
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [200, -200])
          }}
        >
          WORK
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className="overflow-hidden"
            >
              <h2 className="text-5xl md:text-7xl font-display font-light mb-4 tracking-tight">
                Udvalgte Projekter
              </h2>
            </motion.div>
            <motion.div 
              className="w-24 h-px bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              style={{ transformOrigin: 'left' }}
            />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={index}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </>
  );
}

function ProjectCard({ 
  project, 
  index,
  onClick 
}: { 
  project: Project; 
  index: number;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Custom animations based on project title
  const isOrdbomben = project.title.toLowerCase().includes('ordbomben') || project.title.toLowerCase().includes('ord');
  const isLettus = project.title.toLowerCase().includes('lettus') || project.title.toLowerCase().includes('lett');
  const isDump = project.title.toLowerCase().includes('dump');

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[4/3] overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-500">
        {/* Image */}
        <motion.div
          className="relative w-full h-full"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          />
        </motion.div>

        {/* Project-specific hover effects */}
        {isOrdbomben && isHovered && (
          <motion.div className="absolute inset-0 pointer-events-none">
            {/* Bomb explosion particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-purple-500"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i / 12) * Math.PI * 2) * 100,
                  y: Math.sin((i / 12) * Math.PI * 2) * 100,
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </motion.div>
        )}

        {isLettus && isHovered && (
          <motion.div className="absolute inset-0 pointer-events-none">
            {/* Growing leaves */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${20 + i * 15}%`,
                  bottom: 0,
                  fontSize: '2rem',
                }}
                initial={{ y: 0, opacity: 0 }}
                animate={{
                  y: [0, -50, -100],
                  opacity: [0, 1, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                🌿
              </motion.div>
            ))}
          </motion.div>
        )}

        {isDump && isHovered && (
          <motion.div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Vinyl spin + waveform */}
            <motion.div
              className="w-32 h-32 rounded-full border-4 border-white/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
            </motion.div>
          </motion.div>
        )}

        {/* Glow overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Project number */}
        <motion.div
          className="absolute top-4 right-4 text-6xl font-display font-light text-white/10 group-hover:text-white/30 transition-all"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          viewport={{ once: true }}
        >
          {String(index + 1).padStart(2, '0')}
        </motion.div>

        {/* Hover: View button */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-8 py-4 bg-white text-black font-bold text-sm tracking-wider"
            style={{
              boxShadow: '0 0 30px rgba(168, 85, 247, 0.6)',
            }}
          >
            SE CASE STUDY
          </motion.button>
        </motion.div>
      </div>

      {/* Project info */}
      <motion.div 
        className="mt-6 space-y-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
        viewport={{ once: true }}
      >
        <h3 className="text-2xl font-display font-light group-hover:text-purple-400 transition-colors">
          {project.title}
        </h3>
        
        <p className="text-gray-400 leading-relaxed font-light line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.3 + i * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, y: -2 }}
              className="text-xs text-gray-500 border border-white/10 px-3 py-1 hover:border-purple-500/50 hover:text-purple-400 transition-all cursor-default"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl w-full glass-card p-8 md:p-12"
      >
        {/* Close button */}
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 transition-colors z-10"
        >
          <HiX className="text-2xl" />
        </motion.button>

        {/* Content */}
        <div className="space-y-8">
          {/* Project image */}
          <motion.div
            className="relative aspect-video overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Title & description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-light mb-4">
              {project.title}
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              {project.longDesc || project.description}
            </p>
          </motion.div>

          {/* Tags */}
          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm text-purple-400 border border-purple-500/30 px-4 py-2"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Links */}
          <motion.div
            className="flex gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {project.link && (
              <motion.a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium tracking-wider"
                style={{
                  boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)',
                }}
              >
                <HiExternalLink /> BESØG HJEMMESIDE
              </motion.a>
            )}
            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 border border-white/20 hover:bg-white/10 transition-colors tracking-wider"
              >
                <HiCode /> GITHUB
              </motion.a>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
