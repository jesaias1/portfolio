import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { fallbackProjects } from '../src/data/projects'

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

  // Project copy lives in src/data/projects.ts; array order is the display order.
  for (const [index, project] of fallbackProjects.entries()) {
    const data = {
      title: project.title,
      description: project.description,
      longDesc: project.longDesc ?? null,
      image: project.image,
      tags: JSON.stringify(project.tags),
      link: project.link ?? null,
      featured: project.featured,
      order: index + 1,
    }

    await prisma.project.upsert({
      where: { id: project.id },
      update: data,
      create: { id: project.id, ...data },
    })
  }

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
