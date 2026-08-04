'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const defaultSkills = ['Next.js', 'TypeScript', 'Node.js', 'C++ / JUCE', 'PostgreSQL', 'Realtime systems'];

const disciplines = [
  {
    index: '01',
    title: 'Product development',
    text: 'Useful, dependable web products shaped from interface to infrastructure.',
  },
  {
    index: '02',
    title: 'Creative systems',
    text: 'Games and interactive tools where the technical idea is part of the experience.',
  },
  {
    index: '03',
    title: 'Audio software',
    text: 'Instruments and workflows that make sound more tactile, playful and immediate.',
  },
];

type AboutData = {
  title?: string;
  content?: string;
  image?: string;
  skills?: string[];
};

export default function About() {
  const [aboutData, setAboutData] = useState<AboutData>({});

  useEffect(() => {
    fetch('/api/about')
      .then((response) => {
        if (!response.ok) throw new Error('About content unavailable');
        return response.json();
      })
      .then((data) => setAboutData(data))
      .catch(() => undefined);
  }, []);

  const paragraphs = normalizeParagraphs(aboutData.content);
  const skills = aboutData.skills?.length ? aboutData.skills : defaultSkills;
  const image = aboutData.image?.startsWith('/') ? aboutData.image : '/headshot.jpg';

  return (
    <section id="about" className="content-section relative overflow-hidden py-20 md:py-28">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-10 grid gap-5 border-b border-white/10 pb-8 md:mb-14 md:grid-cols-[1fr_auto] md:items-end"
        >
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-[#4ddbff]">
              About / Jesaias
            </p>
            <h2 className="max-w-4xl text-4xl font-bold tracking-[-0.045em] text-white md:text-6xl">
              Building where software, sound and play overlap.
            </h2>
          </div>
          <p className="font-mono text-[10px] uppercase leading-5 tracking-[0.14em] text-gray-600 md:text-right">
            Copenhagen, Denmark<br />Creative developer
          </p>
        </motion.header>

        <div className="grid gap-10 md:grid-cols-[minmax(240px,0.72fr)_minmax(0,1.45fr)] md:items-start md:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative mx-auto w-full max-w-[340px] md:mx-0"
          >
            <div className="relative aspect-[4/5] overflow-hidden border border-white/10 bg-[#090a0b]">
              <Image
                src={image}
                alt="Jesaias, creative developer"
                fill
                sizes="(max-width: 768px) 85vw, 340px"
                className="object-cover object-top grayscale transition duration-700 hover:grayscale-[35%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-[#4ddbff]/[0.04]" />
            </div>
            <div className="flex items-center justify-between border-x border-b border-white/10 px-4 py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-gray-600">
              <span>Creative developer</span>
              <span className="text-[#4ddbff]/70">DK / available</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            viewport={{ once: true }}
          >
            <div className="max-w-3xl space-y-5 text-lg leading-8 text-gray-300 md:text-xl md:leading-9">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-2 border-t border-white/[0.07] pt-6">
              {skills.slice(0, 8).map((skill) => (
                <span
                  key={skill}
                  className="border border-white/10 bg-black/20 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.11em] text-gray-500"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-12 grid border border-white/[0.08] md:grid-cols-3">
          {disciplines.map((discipline) => (
            <article
              key={discipline.title}
              className="grid grid-cols-[auto_1fr] gap-4 border-b border-white/[0.08] p-5 last:border-b-0 md:min-h-[170px] md:border-b-0 md:border-r md:p-6 md:last:border-r-0"
            >
              <span className="font-mono text-[9px] text-[#4ddbff]/60">/{discipline.index}</span>
              <div>
                <h3 className="mb-3 text-lg font-semibold text-white">{discipline.title}</h3>
                <p className="text-sm leading-6 text-gray-500">{discipline.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function normalizeParagraphs(content?: string) {
  if (!content) {
    return [
      'I build digital products from the first idea through the details that make them feel finished. My work moves between full-stack applications, realtime games and native audio software.',
      'The common thread is simple: complex systems should feel clear, responsive and enjoyable to use.',
    ];
  }

  const plainText = content
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

  return plainText.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
}
