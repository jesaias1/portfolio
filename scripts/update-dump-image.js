// Update the dump.media project image in the database
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.project.updateMany({
    where: {
      title: { contains: 'dump' },
    },
    data: {
      image: '/projects/dump-media.png',
    },
  });
  console.log(`Updated ${result.count} project(s) with new dump.media image`);
  
  // Verify
  const projects = await prisma.project.findMany({ where: { title: { contains: 'dump' } } });
  projects.forEach(p => console.log(`  ${p.title}: ${p.image}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
