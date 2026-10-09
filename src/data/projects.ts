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
  category?: string;
  signal?: string;
  caseStudy?: string;
  status?: string;
  visible?: boolean;
  order?: number;
}

// Array order is the display order on the homepage: live work first, anything offline last.
export const fallbackProjects: PortfolioProject[] = [
  {
    id: 'kvizy-007',
    title: 'KVIZY',
    description:
      'A Danish pass-the-device quiz product designed for one shared screen, quick setup and real game-night use.',
    longDesc:
      'KVIZY turns one phone, tablet or screen into a full Danish quiz night. Players or teams pass the device between turns across classic, quick, risk and mystery modes, backed by 1,439 curated questions, offline play, adaptive difficulty, history and rematches.',
    category: 'Web product / PWA',
    signal:
      'Designed and built a Danish quiz product with offline-first flow, mobile UX and practical game-night pacing.',
    caseStudy: '/projects/kvizy',
    image: '/projects/kvizy-mockup.png',
    video: '/projects/videos/kvizy-teaser.mp4',
    tags: ['Next.js 16', 'TypeScript', 'PWA', 'Offline-first', 'Vitest'],
    link: 'https://kvizy.dk',
    featured: true,
    status: 'Live',
    visible: true,
  },
  {
    id: 'orvo-006',
    title: 'ORVO',
    description:
      'A creative audio product for turning samples into evolving playable instruments through tactile controls and visual feedback.',
    longDesc:
      'ORVO turns any sample into an evolving instrument. Cloud, Elastic, Tape and Grain engines combine with PULSE gating, drawn motion, four LFOs, macros and a full effects rack - with finished audio rendered straight back into the DAW.',
    category: 'Creative desktop software',
    signal:
      'Product concept, interface direction and iterative development of a private preview build.',
    caseStudy: '/audio/orvo',
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
    category: 'Audio software',
    signal:
      'Visual MIDI workflow prototype combining product direction, interface design and plugin development.',
    caseStudy: '/audio/midium',
    image: '/projects/midium.png',
    video: '/projects/videos/midium.mp4',
    tags: ['C++', 'JUCE', 'VST3', 'MIDI', 'CMake'],
    link: '/audio/midium',
    featured: true,
    status: 'Beta',
    visible: true,
  },
  {
    id: 'playhead-008',
    title: 'Playhead',
    description:
      'Your music, as a place. Playhead turns any song you drop in into a 3D world you strafe and surf through in first person. Free to play in the browser.',
    longDesc:
      'Playhead analyses an audio file in the browser and builds a world from it: the song ahead is dormant architecture, the now-line ignites it as you arrive, and drops become set pieces. You are the playhead, strafing and surfing through your own music, and every run you win earns a signal drop.',
    category: 'Browser game',
    signal:
      'Designed and built a game that analyses audio in real time and generates its 3D world from the song.',
    image: '/projects/playhead-thumb.webp',
    video: '/projects/videos/playhead-v2.mp4',
    tags: ['Three.js', 'TypeScript', 'Web Audio', 'Procedural 3D', 'Vite'],
    caseStudy: '/projects/playhead',
    // Public path that redirects to the live deployment (see next.config.ts).
    link: '/play/playhead',
    featured: true,
    status: 'Live',
    visible: true,
  },
  {
    id: 'lettus-002',
    title: 'Lettus',
    description:
      'A compact daily word game focused on clean feedback, mobile-first rounds and a simple repeatable loop.',
    longDesc:
      'Lettus is a compact word game built around daily challenges, focused rounds and a crisp mobile experience.',
    category: 'Daily game',
    signal:
      'Designed and iterated a compact daily word game with clear feedback, mobile layout and focused game logic.',
    image: '/projects/lettus.png',
    video: '/projects/videos/lettus.mp4',
    tags: ['React', 'TypeScript', 'Game Logic', 'PWA'],
    link: 'https://www.lettus.fun',
    featured: true,
    status: 'Live',
    visible: true,
  },
  {
    id: 'abyx-005',
    title: 'ABYX',
    description:
      'A controller-based music tool exploring how familiar gamepad input can become a playful performance interface for DAWs.',
    longDesc:
      'ABYX turns Xbox and PlayStation-style controllers into performance hardware for musical gestures, effects, samples and DAW control.',
    category: 'Audio software',
    signal:
      'Creative controller concept shaped around gamepad input, performance UX and plugin workflow experiments.',
    caseStudy: '/audio/abyx',
    image: '/projects/abyx.png',
    video: '/projects/videos/abyx.mp4',
    tags: ['C++', 'JUCE', 'VST3', 'MIDI', 'XInput'],
    link: '/audio/abyx',
    featured: true,
    status: 'Beta',
    visible: true,
  },
  {
    id: 'ordbomben-001',
    title: 'Ordbomben',
    description:
      'A real-time multiplayer word game built around speed, pressure, score logic and responsive rounds.',
    longDesc:
      'Ordbomben is a real-time multiplayer word game focused on speed, pressure and playful competition.',
    category: 'Real-time web product',
    signal:
      'Developed and refined a real-time multiplayer word game with game flow, score logic and responsive play.',
    image: '/projects/ordbomben.png',
    video: '/projects/videos/ordbomben.mp4',
    tags: ['Next.js', 'WebSocket', 'Real-time', 'Game'],
    // Public path that redirects to the live deployment (see next.config.ts), so the hosting URL is never shown.
    link: '/play/ordbomben',
    featured: true,
    status: 'Live',
    visible: true,
  },
];
