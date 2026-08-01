'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { fallbackProjects, type PortfolioProject } from '@/data/projects';
import { useSound } from '@/hooks/use-sound';

const projectPresentation: Record<string, { category: string; status: string; caseStudy?: string }> = {
  orvo: { category: 'Audio software', status: 'In development', caseStudy: '/audio/orvo' },
  midium: { category: 'Audio software', status: 'Beta', caseStudy: '/audio/midium' },
  abyx: { category: 'Audio software', status: 'Beta', caseStudy: '/audio/abyx' },
  kvizy: { category: 'Game / PWA', status: 'Live', caseStudy: '/projects/kvizy' },
  ordbomben: { category: 'Multiplayer game', status: 'Live' },
  lettus: { category: 'Daily game', status: 'Live' },
  'dump.media': { category: 'Music platform', status: 'Concept' },
};

export default function Projects() {
  const [projects, setProjects] = useState<PortfolioProject[]>(fallbackProjects);

  useEffect(() => {
    fetch('/api/projects')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch projects');
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) return;

        const apiProjects = data as PortfolioProject[];
        const localOnly = fallbackProjects.filter(
          (fallback) =>
            !apiProjects.some(
              (project) =>
                project.id === fallback.id ||
                project.title.toLowerCase() === fallback.title.toLowerCase()
            )
        );

        setProjects([...localOnly, ...apiProjects]);
      })
      .catch(() => setProjects(fallbackProjects));
  }, []);

  return (
    <section id="projects" className="relative overflow-hidden py-20 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[520px] max-w-6xl bg-[radial-gradient(circle_at_50%_0%,rgba(77,219,255,0.07),transparent_58%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6">
        <motion.header
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-10 grid gap-6 border-b border-white/10 pb-8 md:mb-14 md:grid-cols-[1fr_auto] md:items-end"
        >
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#4ddbff]">
                Selected work
              </span>
              <span className="h-px w-12 bg-[#4ddbff]/30" />
            </div>
            <h2 className="max-w-4xl text-4xl font-bold tracking-[-0.045em] text-white md:text-6xl lg:text-7xl">
              Tools, games and systems made to be used.
            </h2>
          </div>
          <p className="max-w-xs font-mono text-[11px] leading-6 text-gray-600 md:text-right">
            {String(projects.length).padStart(2, '0')} projects / software, sound and playful systems
          </p>
        </motion.header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: PortfolioProject; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const [touchLayout, setTouchLayout] = useState(false);
  const inView = useInView(cardRef, { amount: 0.42 });
  const reduceMotion = useReducedMotion();
  const { play } = useSound();

  const key = project.title.toLowerCase();
  const presentation = projectPresentation[key] ?? {
    category: project.tags[0] ?? 'Digital product',
    status: project.featured ? 'Featured' : 'Project',
  };
  const liveHref = project.link && isExternal(project.link) ? project.link : undefined;
  const primaryHref = presentation.caseStudy ?? project.link;
  const showVideo = Boolean(project.video) && !reduceMotion && (touchLayout ? inView : hovered);

  const tags = project.tags.slice(0, 4);

  useEffect(() => {
    const media = window.matchMedia('(hover: none), (pointer: coarse)');
    const update = () => setTouchLayout(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (showVideo) video.play().catch(() => undefined);
    else video.pause();
  }, [showVideo]);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      transition={{ duration: 0.65, delay: Math.min(index * 0.045, 0.2), ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: '-70px' }}
      onMouseEnter={() => {
        setHovered(true);
        play('hover');
      }}
      onMouseLeave={() => setHovered(false)}
      className="group relative overflow-hidden border border-white/[0.09] bg-[#0a0b0c]/90 transition-colors duration-500 hover:border-[#4ddbff]/30"
    >
      {primaryHref ? (
        <a
          href={primaryHref}
          target={isExternal(primaryHref) ? '_blank' : undefined}
          rel={isExternal(primaryHref) ? 'noopener noreferrer' : undefined}
          aria-label={`Open ${project.title}`}
          className="absolute inset-0 z-20"
          onClick={() => play('click')}
        />
      ) : null}

      <div className="relative aspect-[16/10] overflow-hidden border-b border-white/[0.07] bg-black">
        <Image
          src={project.image}
          alt={`${project.title} project preview`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
          style={{ filter: showVideo ? 'none' : 'saturate(.74) brightness(.76)' }}
        />

        {project.video ? (
          <video
            ref={videoRef}
            src={project.video}
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${showVideo ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : null}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070809]/75 via-transparent to-black/10" />
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-white/70 sm:left-5 sm:top-5">
          <span className="border border-white/15 bg-black/55 px-2 py-1.5 backdrop-blur-md">
            {presentation.category}
          </span>
          <span className="border border-[#4ddbff]/20 bg-black/55 px-2 py-1.5 text-[#4ddbff]/80 backdrop-blur-md">
            {presentation.status}
          </span>
        </div>
        <span className="absolute bottom-4 right-4 z-10 font-mono text-[10px] text-white/35 sm:bottom-5 sm:right-5">
          /{String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="relative min-h-[260px] p-5 sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-6">
          <h3 className="text-3xl font-bold tracking-[-0.045em] text-white transition-colors group-hover:text-[#4ddbff] sm:text-4xl">
            {project.title}
          </h3>
          <span className="mt-2 text-xl text-[#4ddbff]/45 transition-transform duration-300 group-hover:translate-x-1">↗</span>
        </div>

        <p className="max-w-xl text-sm leading-6 text-gray-400 sm:text-[15px]">
          {project.description}
        </p>

        <div className="mt-7 flex flex-wrap items-end justify-between gap-5 border-t border-white/[0.07] pt-5">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {tags.map((tag) => (
              <span key={tag} className="font-mono text-[9px] uppercase tracking-[0.1em] text-gray-600">
                {tag}
              </span>
            ))}
          </div>

          <div className="relative z-30 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.1em]">
            {presentation.caseStudy ? (
              <a href={presentation.caseStudy} className="text-[#4ddbff] hover:text-white" onClick={() => play('click')}>
                Case study
              </a>
            ) : null}
            {liveHref ? (
              <a href={liveHref} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white" onClick={() => play('click')}>
                Live site ↗
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}
