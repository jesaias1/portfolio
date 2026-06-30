'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { HiExternalLink, HiCode } from 'react-icons/hi';
import Parallax from './Parallax';
import { useSound } from '@/hooks/use-sound';
import RevealText from './RevealText';
import { fallbackProjects, type PortfolioProject } from '@/data/projects';

export default function Projects() {
  const [projects, setProjects] = useState<PortfolioProject[]>(fallbackProjects);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch projects');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setProjects(data);
      })
      .catch(() => {
        setProjects(fallbackProjects);
      });
  }, []);

  return (
    <>
      <section ref={sectionRef} id="projects" className="py-20 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section header — terminal style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-sm text-[#4ddbff]" style={{ textShadow: '0 0 8px rgba(77, 219, 255, 0.3)' }}>
                ~/projects
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-[#4ddbff]/20 to-transparent" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Featured Projects
            </h2>
            <p className="text-gray-500 mt-3 font-mono text-sm">
              {'>'} ls -la ./projects --sort=featured
            </p>
          </motion.div>

          {/* Projects — full-width stacked layout */}
          <div className="space-y-14 md:space-y-24">
            {projects.map((project, index) => (
              <ProjectRow
                key={project.id}
                project={project}
                index={index}
                onClick={() => setSelectedProject(project)}
                isReversed={index % 2 === 1}
              />
            ))}
          </div>

          {/* Empty state */}
          {projects.length === 0 && (
            <div className="text-center py-20">
              <div className="font-mono text-sm text-gray-600">Projects unavailable.</div>
            </div>
          )}
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

function ProjectRow({
  project,
  index,
  onClick,
  isReversed
}: {
  project: PortfolioProject;
  index: number;
  onClick: () => void;
  isReversed: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(containerRef, { amount: 0.5 });

  const { play } = useSound();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const shouldShowVideo = isMobile ? isInView : isHovered;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldShowVideo) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [shouldShowVideo]);

  const openSite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.link) {
      play('click');
      window.open(project.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, x: isReversed ? 40 : -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
      onAnimationStart={() => {
        if (isInView) window.dispatchEvent(new Event('glitch-flash'));
      }}
      onMouseEnter={() => { setIsHovered(true); play('hover'); }}
      onMouseLeave={() => setIsHovered(false)}
      className="grid md:grid-cols-2 gap-8 md:gap-12 items-center group"
    >
      {/* Thumbnail — click goes to live site */}
      <div
        onClick={openSite}
        className={`relative aspect-video overflow-hidden border border-white/5 group-hover:border-[#4ddbff]/30 transition-all duration-500 cursor-pointer ${isReversed ? 'md:order-2' : ''}`}
      >
        <Parallax offset={20} className="w-full h-full">
          <div className="relative w-full h-full">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-all duration-700 group-hover:scale-105"
              style={{ filter: shouldShowVideo ? 'none' : 'grayscale(60%) brightness(0.7)' }}
            />
          </div>
        </Parallax>

        {/* Video — always mounted, shown via CSS opacity for smooth instant reveal */}
        {project.video && (
          <div
            className="absolute inset-0 z-10 transition-opacity duration-700"
            style={{ opacity: shouldShowVideo ? 1 : 0 }}
          >
            <video
              ref={videoRef}
              src={project.video}
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Bottom gradient + scan line — fades in with video */}
        <div
          className="absolute inset-0 z-20 transition-opacity duration-300 pointer-events-none"
          style={{ opacity: isHovered ? 1 : 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/70 via-transparent to-transparent" />
        </div>

        {/* Project number */}
        <div className="absolute top-4 right-4 z-30 font-mono text-xs text-white/20 group-hover:text-[#4ddbff]/50 transition-all">
          [{String(index + 1).padStart(2, '0')}]
        </div>
      </div>

      {/* Info */}
      <div className={`space-y-4 ${isReversed ? 'md:order-1' : ''}`}>
        <div>
          <h3 className="text-2xl md:text-4xl font-bold tracking-tight group-hover:text-[#4ddbff] transition-colors duration-300">
            <RevealText text={project.title} delay={0.2} />
          </h3>
          <div className="w-12 h-px bg-[#4ddbff]/30 mt-3 group-hover:w-24 transition-all duration-500" />
        </div>

        <p className="text-gray-400 leading-relaxed text-sm md:text-base">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] text-gray-600 border border-white/5 px-2 py-1 group-hover:border-[#4ddbff]/20 group-hover:text-[#4ddbff]/60 transition-all"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-2">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { e.stopPropagation(); play('click'); }}
              className="font-mono text-xs px-4 py-2 bg-[#4ddbff]/10 border border-[#4ddbff]/30 text-[#4ddbff] hover:bg-[#4ddbff]/20 hover:border-[#4ddbff]/60 transition-all"
            >
              {'>'} ./visit_site
            </a>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onClick(); play('click'); }}
            className="font-mono text-xs text-gray-600 hover:text-[#4ddbff]/70 transition-colors"
          >
            {'>'} ./details
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectModal({ project, onClose }: { project: PortfolioProject; onClose: () => void }) {
  const { play } = useSound();
  
  useEffect(() => {
    play('on');
  }, [play]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-start md:items-center justify-center p-4 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl w-full bg-[#0c0c0c] border border-[rgba(0,255,65,0.1)] p-6 md:p-12 my-4 md:my-0"
      >
        {/* Terminal header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] cursor-pointer" onClick={onClose} />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <span className="font-mono text-xs text-gray-600">
              ~/projects/{project.title.toLowerCase().replace(/\s+/g, '-')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-xs text-gray-600 hover:text-[#4ddbff] transition-colors"
          >
            [ESC]
          </button>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Project image */}
          <motion.div
            className="relative aspect-video overflow-hidden border border-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {project.video ? (
              <video
                src={project.video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 900px"
              />
            )}
          </motion.div>

          {/* Title & description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              {project.link ? (
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#4ddbff] hover:underline decoration-2 underline-offset-4 transition-all"
                >
                  {project.title}
                </a>
              ) : (
                project.title
              )}
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              {project.longDesc || project.description}
            </p>
          </motion.div>

          {/* Tags */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs text-[#4ddbff]/70 border border-[#4ddbff]/20 px-3 py-1.5"
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 font-mono text-sm bg-[#4ddbff]/10 border border-[#4ddbff]/40 text-[#4ddbff] hover:bg-[#4ddbff]/20 transition-all"
              >
                <HiExternalLink /> ./visit_site
              </motion.a>
            )}
            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 font-mono text-sm border border-gray-700 text-gray-400 hover:border-gray-500 transition-all"
              >
                <HiCode /> ./github
              </motion.a>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
