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
  status?: string;
  visible?: boolean;
  order?: number;
}

export const fallbackProjects: PortfolioProject[] = [
  {
    id: 'orvo-006',
    title: 'ORVO',
    description:
      'A creative audio product for turning samples into evolving playable instruments through tactile controls and visual feedback.',
    longDesc:
      'ORVO turns any sample into an evolving instrument. Cloud, Elastic, Tape and Grain engines combine with PULSE gating, drawn motion, four LFOs, macros and a full effects rack - with finished audio rendered straight back into the DAW.',
    image: '/projects/orvo-mockup.png',
    video: '/projects/videos/orvo-teaser.mp4',
    tags: ['C++20', 'JUCE 8', 'VST3', 'Audio DSP', 'CMake'],
    link: '/audio/orvo',
    featured: true,
    status: 'In development',
    visible: true,
  },
  {
    id: 'midium-004',
    title: 'MIDIUM',
    description:
      'A visual MIDI instrument concept for sketching melodies, basslines and patterns directly into a producer-focused piano roll.',
    longDesc:
      'MIDIUM is a visual MIDI instrument for quickly turning drawn gestures into playable musical ideas, built for fast DAW workflows and standalone experimentation.',
    image: '/projects/midium.png',
    video: '/projects/videos/midium.mp4',
    tags: ['C++', 'JUCE', 'VST3', 'MIDI', 'CMake'],
    link: '/audio/midium',
    featured: true,
    status: 'Beta',
    visible: true,
  },
  {
    id: 'abyx-005',
    title: 'ABYX',
    description:
      'A controller-based music tool exploring how familiar gamepad input can become a playful performance interface for DAWs.',
    longDesc:
      'ABYX turns Xbox and PlayStation-style controllers into performance hardware for musical gestures, effects, samples and DAW control.',
    image: '/projects/abyx.png',
    video: '/projects/videos/abyx.mp4',
    tags: ['C++', 'JUCE', 'VST3', 'MIDI', 'XInput'],
    link: '/audio/abyx',
    featured: true,
    status: 'Beta',
    visible: true,
  },
  {
    id: 'kvizy-007',
    title: 'KVIZY',
    description:
      'A Danish pass-the-device quiz product designed for one shared screen, quick setup and real game-night use.',
    longDesc:
      'KVIZY turns one phone, tablet or screen into a full Danish quiz night. Players or teams pass the device between turns across classic, quick, risk and mystery modes, backed by 1,439 curated questions, offline play, adaptive difficulty, history and rematches.',
    image: '/projects/kvizy-mockup.png',
    video: '/projects/videos/kvizy-teaser.mp4',
    tags: ['Next.js 16', 'TypeScript', 'PWA', 'Offline-first', 'Vitest'],
    link: 'https://kvizy.dk',
    featured: true,
    status: 'Live',
    visible: true,
  },
  {
    id: 'ordbomben-001',
    title: 'Ordbomben',
    description:
      'A real-time multiplayer word game built around speed, pressure, score logic and responsive rounds.',
    longDesc:
      'Ordbomben is a real-time multiplayer word game focused on speed, pressure and playful competition.',
    image: '/projects/ordbomben.png',
    video: '/projects/videos/ordbomben.mp4',
    tags: ['Next.js', 'WebSocket', 'Real-time', 'Game'],
    link: 'https://www.ordbomben.dk',
    featured: true,
    status: 'Under maintenance',
    visible: true,
  },
  {
    id: 'lettus-002',
    title: 'Lettus',
    description:
      'A compact daily word game focused on clean feedback, mobile-first rounds and a simple repeatable loop.',
    longDesc:
      'Lettus is a compact word game built around daily challenges, focused rounds and a crisp mobile experience.',
    image: '/projects/lettus.png',
    video: '/projects/videos/lettus.mp4',
    tags: ['React', 'TypeScript', 'Game Logic', 'PWA'],
    link: 'https://www.lettus.fun',
    featured: true,
    status: 'Live',
    visible: true,
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
    status: 'Under maintenance',
    visible: true,
  },
];
