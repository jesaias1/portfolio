import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('miebs112', 10)
  
  await prisma.user.upsert({
    where: { email: 'lin4s@live.dk' },
    update: {},
    create: {
      email: 'lin4s@live.dk',
      password: hashedPassword,
      name: 'Linas Jesaias',
    },
  })

  // Create your 3 live projects
  await prisma.project.upsert({
    where: { id: 'ordbomben-001' },
    update: {},
    create: {
      id: 'ordbomben-001',
      title: 'Ordbomben',
      description: 'Multiplayer ordspil hvor 1-16 spillere kæmper om at finde flest ord før tiden løber ud.',
      longDesc: 'Ordbomben er et intenst multiplayer ordspil bygget med Next.js og WebSocket teknologi. Spillere konkurrerer i real-time om at finde flest mulige ord fra et tilfældigt sæt bogstaver. Med support for op til 16 spillere samtidigt, leaderboards, og forskellige spiltilstande, leverer Ordbomben en spændende og social gaming oplevelse.',
      image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=800',
      tags: JSON.stringify(['Next.js', 'WebSocket', 'PostgreSQL', 'Real-time', 'Multiplayer']),
      link: 'https://www.ordbomben.dk',
      featured: true,
      order: 1,
    },
  })

  await prisma.project.upsert({
    where: { id: 'lettus-002' },
    update: {},
    create: {
      id: 'lettus-002',
      title: 'Lettus',
      description: 'Wordle-inspireret ordgættespil med daglige udfordringer og progressive sværhedsgrader.',
      longDesc: 'Lettus er et engagerende ordgættespil inspireret af Wordle, hvor spillere har 6 forsøg på at gætte dagens ord. Spillet tilbyder daglige udfordringer, statistik tracking, og en progressiv sværhedsgrad der holder spillere engaged. Bygget med moderne web teknologier for en smooth og responsiv oplevelse på alle enheder.',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
      tags: JSON.stringify(['React', 'TypeScript', 'Game Logic', 'PWA', 'Mobile First']),
      link: 'https://www.lettus.fun',
      featured: true,
      order: 2,
    },
  })

  await prisma.project.upsert({
    where: { id: 'dump-003' },
    update: {},
    create: {
      id: 'dump-003',
      title: 'dump.media',
      description: 'Producer beat marketplace hvor musikskabere kan købe og sælge beats med abonnementsbaseret adgang.',
      longDesc: 'dump.media er en professionel platform for producere og kunstnere. Platformen forbinder beat producere med kunstnere gennem et intuitivt interface hvor brugere kan browse, preview, og købe beats. Med features som creator profiles, avanceret søgning og filtrering, subscription management, og sikker betaling, er dump.media den ultimative destination for musikproduktion.',
      image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800',
      tags: JSON.stringify(['Next.js', 'Stripe', 'Audio Player', 'E-commerce', 'Subscriptions']),
      link: 'https://www.dump.media',
      featured: true,
      order: 3,
    },
  })

  // Create about section
  await prisma.about.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      content: `
        <p>Hej! Jeg er Linas Jesaias, en passioneret udvikler der elsker at skabe digitale oplevelser der både ser fantastiske ud og fungerer perfekt.</p>
        <p>Med over 2+ års erfaring inden for web udvikling har jeg hjulpet brands og virksomheder med at realisere deres digitale visioner gennem moderne teknologi og kreativt design.</p>
        <p>Min mission er at transformere komplekse idéer til brugervenlige, smukke og skalerbare løsninger. Jeg specialiserer mig i multiplayer gaming platforme, e-commerce løsninger, og interactive web applikationer.</p>
      `,
    },
  })

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
