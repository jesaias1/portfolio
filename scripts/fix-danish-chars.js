const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Update Ordbomben
  const ordbomben = await prisma.project.findFirst({ where: { title: { contains: 'Ordbomben', mode: 'insensitive' } } });
  if (ordbomben) {
    await prisma.project.update({
      where: { id: ordbomben.id },
      data: {
        description: 'Multiplayer ordspil hvor 1-16 spillere kæmper om at finde flest ord før tiden løber ud.',
        longDesc: 'Ordbomben er et intenst multiplayer ordspil bygget med Next.js og WebSocket teknologi. Spillere konkurrerer i real-time om at finde flest mulige ord fra et tilfældigt sæt bogstaver.',
      },
    });
    console.log('Fixed Ordbomben');
  }

  // Update Lettus
  const lettus = await prisma.project.findFirst({ where: { title: { contains: 'Lettus', mode: 'insensitive' } } });
  if (lettus) {
    await prisma.project.update({
      where: { id: lettus.id },
      data: {
        description: 'Wordle-inspireret ordgættespil med daglige udfordringer og progressive sværhedsgrader.',
        longDesc: 'Lettus er et engagerende ordgættespil inspireret af Wordle, hvor spillere har 6 forsøg på at gætte dagens ord. Spillet tilbyder daglige udfordringer og statistik tracking.',
      },
    });
    console.log('Fixed Lettus');
  }

  // Update Dump
  const dump = await prisma.project.findFirst({ where: { title: { contains: 'dump', mode: 'insensitive' } } });
  if (dump) {
    await prisma.project.update({
      where: { id: dump.id },
      data: {
        description: 'Producer beat marketplace hvor musikskabere kan købe og sælge beats med abonnementsbaseret adgang.',
        longDesc: 'dump.media er en professionel platform for producere og kunstnere. Platformen forbinder beat producere med kunstnere gennem et intuitivt interface.',
      },
    });
    console.log('Fixed Dump');
  }

  // Update About
  const about = await prisma.about.findFirst();
  if (about) {
    await prisma.about.update({
      where: { id: about.id },
      data: {
        content: '<p>Hej! Jeg er Linas Jesaias, en passioneret udvikler der elsker at skabe digitale oplevelser der både ser fantastiske ud og fungerer perfekt.</p><p>Med over 2+ års erfaring inden for web udvikling har jeg hjulpet brands og virksomheder med at realisere deres digitale visioner gennem moderne teknologi og kreativt design.</p><p>Min mission er at transformere komplekse ideer til brugervenlige, smukke og skalerbare løsninger.</p>',
      },
    });
    console.log('Fixed About');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
