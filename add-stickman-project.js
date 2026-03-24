const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // First update others to false if they want only 3 featured project maybe, but let's just create it as featured and let it be added to the list.
  const result = await prisma.project.create({
    data: {
      id: 'stickman-knockout',
      title: 'Stickman Knockout',
      description: 'A fast-paced multiplayer fighting game where the goal is to be the last stickman standing by pushing opponents out of the arena.',
      longDesc: 'Stickman Knockout is an intense multiplayer physics-based brawler featuring solo and duo campaigns, local versus, and online multiplayer. Players use strategic movement, powerful dashes, and a variety of colorful skins to knock their opponents off the stage and claim victory.',
      image: '/projects/images/stickman-knockout.png',
      tags: JSON.stringify(['React', 'TypeScript', 'Game Development', 'Multiplayer', 'WebSocket']),
      link: 'https://stickmatchup.vercel.app',
      featured: true
    }
  });

  console.log("Successfully added project:", result.title);
}

const fs = require('fs');
main()
  .catch(e => {
    fs.writeFileSync('err.txt', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
