import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim()
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set before running the seed script')
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10)
  
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Linas Jesaias',
    },
  })

  await prisma.project.upsert({
    where: { id: 'orvo-006' },
    update: {
      title: 'ORVO',
      description: 'A creative audio product for turning samples into evolving playable instruments through tactile controls and visual feedback.',
      longDesc: 'ORVO turns any sample into an evolving instrument. Cloud, Elastic, Tape and Grain engines combine with PULSE gating, drawn motion, four LFOs, macros and a full effects rack - with finished audio rendered straight back into the DAW.',
      image: '/projects/orvo-mockup.png',
      tags: JSON.stringify(['C++20', 'JUCE 8', 'VST3', 'Audio DSP', 'CMake']),
      link: '/audio/orvo',
      featured: true,
      order: 2,
    },
    create: {
      id: 'orvo-006',
      title: 'ORVO',
      description: 'A creative audio product for turning samples into evolving playable instruments through tactile controls and visual feedback.',
      longDesc: 'ORVO turns any sample into an evolving instrument. Cloud, Elastic, Tape and Grain engines combine with PULSE gating, drawn motion, four LFOs, macros and a full effects rack - with finished audio rendered straight back into the DAW.',
      image: '/projects/orvo-mockup.png',
      tags: JSON.stringify(['C++20', 'JUCE 8', 'VST3', 'Audio DSP', 'CMake']),
      link: '/audio/orvo',
      featured: true,
      order: 2,
    },
  })

  await prisma.project.upsert({
    where: { id: 'ordbomben-001' },
    update: {
      description: 'A real-time multiplayer word game built around speed, pressure, score logic and responsive rounds.',
      order: 4,
    },
    create: {
      id: 'ordbomben-001',
      title: 'Ordbomben',
      description: 'A real-time multiplayer word game built around speed, pressure, score logic and responsive rounds.',
      longDesc: 'Ordbomben is an intense multiplayer word game built with Next.js and WebSocket technology. Players compete in real-time to find the most possible words from a random set of letters.',
      image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=800',
      tags: JSON.stringify(['Next.js', 'WebSocket', 'PostgreSQL', 'Real-time', 'Multiplayer']),
      link: 'https://www.ordbomben.dk',
      featured: true,
      order: 4,
    },
  })

  await prisma.project.upsert({
    where: { id: 'lettus-002' },
    update: {
      description: 'A compact daily word game focused on clean feedback, mobile-first rounds and a simple repeatable loop.',
      order: 7,
    },
    create: {
      id: 'lettus-002',
      title: 'Lettus',
      description: 'A compact daily word game focused on clean feedback, mobile-first rounds and a simple repeatable loop.',
      longDesc: 'Lettus is an engaging word guessing game inspired by Wordle, where players have 6 attempts to guess the word of the day. The game offers daily challenges and stat tracking.',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
      tags: JSON.stringify(['React', 'TypeScript', 'Game Logic', 'PWA', 'Mobile First']),
      link: 'https://www.lettus.fun',
      featured: true,
      order: 7,
    },
  })

  await prisma.project.upsert({
    where: { id: 'dump-003' },
    update: {
      description: 'A producer marketplace concept for browsing audio, presenting creator profiles and shaping media-commerce flows.',
      order: 8,
    },
    create: {
      id: 'dump-003',
      title: 'dump.media',
      description: 'A producer marketplace concept for browsing audio, presenting creator profiles and shaping media-commerce flows.',
      longDesc: 'dump.media is a professional platform for producers and artists. The platform connects beat producers with artists through an intuitive interface.',
      image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800',
      tags: JSON.stringify(['Next.js', 'Stripe', 'Audio Player', 'E-commerce', 'Subscriptions']),
      link: 'https://www.dump.media',
      featured: true,
      order: 8,
    },
  })

  await prisma.project.upsert({
    where: { id: 'midium-004' },
    update: {
      title: 'MIDIUM',
      description: 'A visual MIDI instrument concept for sketching melodies, basslines and patterns directly into a producer-focused piano roll.',
      longDesc: 'A creative MIDI-drawing VST that lets producers sketch melodies, basslines and patterns directly into a visual piano roll, turning hand-drawn shapes into playable MIDI.',
      image: '/projects/midium.png',
      tags: JSON.stringify(['C++', 'JUCE', 'VST3', 'MIDI', 'CMake']),
      featured: true,
      order: 5,
    },
    create: {
      id: 'midium-004',
      title: 'MIDIUM',
      description: 'A visual MIDI instrument concept for sketching melodies, basslines and patterns directly into a producer-focused piano roll.',
      longDesc: 'A creative MIDI-drawing VST that lets producers sketch melodies, basslines and patterns directly into a visual piano roll, turning hand-drawn shapes into playable MIDI.',
      image: '/projects/midium.png',
      tags: JSON.stringify(['C++', 'JUCE', 'VST3', 'MIDI', 'CMake']),
      featured: true,
      order: 5,
    },
  })

  await prisma.project.upsert({
    where: { id: 'abyx-005' },
    update: {
      title: 'ABYX',
      description: 'A controller-based music tool exploring how familiar gamepad input can become a playful performance interface for DAWs.',
      longDesc: 'A gamepad-powered music controller for DAWs, built to trigger sounds, control effects and perform music using Xbox and PlayStation controllers.',
      image: '/projects/abyx.png',
      tags: JSON.stringify(['C++', 'JUCE', 'VST3', 'MIDI', 'XInput', 'HID', 'CMake']),
      featured: true,
      order: 6,
    },
    create: {
      id: 'abyx-005',
      title: 'ABYX',
      description: 'A controller-based music tool exploring how familiar gamepad input can become a playful performance interface for DAWs.',
      longDesc: 'A gamepad-powered music controller for DAWs, built to trigger sounds, control effects and perform music using Xbox and PlayStation controllers.',
      image: '/projects/abyx.png',
      tags: JSON.stringify(['C++', 'JUCE', 'VST3', 'MIDI', 'XInput', 'HID', 'CMake']),
      featured: true,
      order: 6,
    },
  })

  await prisma.project.upsert({
    where: { id: 'kvizy-007' },
    update: {
      title: 'KVIZY',
      description: 'A Danish pass-the-device quiz product designed for one shared screen, quick setup and real game-night use.',
      longDesc: 'KVIZY turns one phone, tablet or screen into a full Danish quiz night. Players or teams pass the device between turns across classic, quick, risk and mystery modes, backed by 1,439 curated questions, offline play, adaptive difficulty, history and rematches.',
      image: '/projects/kvizy-mockup.png',
      tags: JSON.stringify(['Next.js 16', 'TypeScript', 'PWA', 'Offline-first', 'Vitest']),
      link: 'https://kvizy.dk',
      featured: true,
      order: 1,
    },
    create: {
      id: 'kvizy-007',
      title: 'KVIZY',
      description: 'A Danish pass-the-device quiz product designed for one shared screen, quick setup and real game-night use.',
      longDesc: 'KVIZY turns one phone, tablet or screen into a full Danish quiz night. Players or teams pass the device between turns across classic, quick, risk and mystery modes, backed by 1,439 curated questions, offline play, adaptive difficulty, history and rematches.',
      image: '/projects/kvizy-mockup.png',
      tags: JSON.stringify(['Next.js 16', 'TypeScript', 'PWA', 'Offline-first', 'Vitest']),
      link: 'https://kvizy.dk',
      featured: true,
      order: 1,
    },
  })

  await prisma.about.upsert({
    where: { id: 'main' },
    update: {
      content: '<p>I build digital products from the first idea through the details that make them feel finished. My work moves between web products, interactive systems and creative software.</p><p>My background started in visual design and grew into product development. I work hands-on across direction, interface, prototyping, testing and implementation, using modern AI-assisted development tools while keeping product and visual judgement at the center.</p>',
      skills: JSON.stringify(['React / Next.js', 'TypeScript', 'Tailwind', 'Framer Motion', 'JUCE / C++', 'Unity / C#', 'PWA / offline-first', 'WebSockets']),
    },
    create: {
      id: 'main',
      title: 'About Me',
      content: '<p>I build digital products from the first idea through the details that make them feel finished. My work moves between web products, interactive systems and creative software.</p><p>My background started in visual design and grew into product development. I work hands-on across direction, interface, prototyping, testing and implementation, using modern AI-assisted development tools while keeping product and visual judgement at the center.</p>',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      skills: JSON.stringify(['React / Next.js', 'TypeScript', 'Tailwind', 'Framer Motion', 'JUCE / C++', 'Unity / C#', 'PWA / offline-first', 'WebSockets']),
    },
  })

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
