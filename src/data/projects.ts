export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
  featured: boolean;
  longDesc?: string;
  video?: string | null;
}

export const fallbackProjects: PortfolioProject[] = [
  {
    id: 'orvo-006',
    title: 'ORVO',
    description:
      'A sample-transformation instrument for stretching, freezing, granulating and rhythmically reshaping sound.',
    longDesc:
      'ORVO turns any sample into an evolving instrument. Cloud, Elastic, Tape and Grain engines combine with PULSE gating, drawn motion, four LFOs, macros and a full effects rack - with finished audio rendered straight back into the DAW.',
    image: '/projects/orvo.png',
    video: null,
    tags: ['C++20', 'JUCE 8', 'VST3', 'Audio DSP', 'CMake'],
    link: '/audio/orvo',
    featured: true,
  },
  {
    id: 'midium-004',
    title: 'MIDIUM',
    description:
      'A creative MIDI-drawing VST that lets producers sketch melodies, basslines and patterns directly into a visual piano roll.',
    longDesc:
      'MIDIUM is a visual MIDI instrument for quickly turning drawn gestures into playable musical ideas, built for fast DAW workflows and standalone experimentation.',
    image: '/projects/midium.png',
    video: '/projects/videos/midium.mp4',
    tags: ['C++', 'JUCE', 'VST3', 'MIDI', 'CMake'],
    link: '/audio/midium',
    featured: true,
  },
  {
    id: 'abyx-005',
    title: 'ABYX',
    description:
      'A gamepad-powered music controller for DAWs, built to trigger sounds, control effects and perform music with familiar controllers.',
    longDesc:
      'ABYX turns Xbox and PlayStation-style controllers into performance hardware for musical gestures, effects, samples and DAW control.',
    image: '/projects/abyx.png',
    video: '/projects/videos/abyx.mp4',
    tags: ['C++', 'JUCE', 'VST3', 'MIDI', 'XInput'],
    link: '/audio/abyx',
    featured: true,
  },
  {
    id: 'kvizy-007',
    title: 'KVIZY',
    description:
      'A complete Danish pass-the-device quiz game for game nights, families, parties and friendly competition.',
    longDesc:
      'KVIZY turns one phone, tablet or screen into a full Danish quiz night. Players or teams pass the device between turns across classic, quick, risk and mystery modes, backed by 1,439 curated questions, offline play, adaptive difficulty, history and rematches.',
    image: '/projects/kvizy.png',
    video: null,
    tags: ['Next.js 16', 'TypeScript', 'PWA', 'Offline-first', 'Vitest'],
    link: 'https://kvizy.dk',
    featured: true,
  },
  {
    id: 'ordbomben-001',
    title: 'Ordbomben',
    description:
      'Multiplayer word game where players compete in real time to find the most words before time runs out.',
    longDesc:
      'Ordbomben is a real-time multiplayer word game focused on speed, pressure and playful competition.',
    image: '/projects/ordbomben.png',
    video: '/projects/videos/ordbomben.mp4',
    tags: ['Next.js', 'WebSocket', 'Real-time', 'Game'],
    link: 'https://www.ordbomben.dk',
    featured: true,
  },
  {
    id: 'lettus-002',
    title: 'Lettus',
    description:
      'Wordle-inspired word guessing game with daily challenges, clean feedback and mobile-first play.',
    longDesc:
      'Lettus is a compact word game built around daily challenges, focused rounds and a crisp mobile experience.',
    image: '/projects/lettus.png',
    video: '/projects/videos/lettus.mp4',
    tags: ['React', 'TypeScript', 'Game Logic', 'PWA'],
    link: 'https://www.lettus.fun',
    featured: true,
  },
  {
    id: 'dump-003',
    title: 'dump.media',
    description:
      'Producer beat marketplace for buying, selling and discovering beats with a polished media workflow.',
    longDesc:
      'dump.media is a producer-focused marketplace concept combining audio browsing, creator profiles and commerce flows.',
    image: '/projects/dump-media.png',
    video: '/projects/videos/dump-media.mp4',
    tags: ['Next.js', 'Stripe', 'Audio', 'Commerce'],
    link: 'https://www.dump.media',
    featured: true,
  },
];
