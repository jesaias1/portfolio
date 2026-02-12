
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting final project updates...');

  // Update Ordbomben
  try {
    const ordbomben = await prisma.project.findFirst({
      where: { title: { contains: 'Ordbomben', mode: 'insensitive' } },
    });
    if (ordbomben) {
      await prisma.project.update({
        where: { id: ordbomben.id },
        data: { link: 'https://ordbomben.dk' },
      });
      console.log('✅ Updated Ordbomben link');
    } else {
      console.log('⚠️ Ordbomben not found');
    }
  } catch (e) {
    console.error('Error updating Ordbomben:', e);
  }

  // Update Dump
  try {
    const dump = await prisma.project.findFirst({
      where: { title: { contains: 'Dump', mode: 'insensitive' } },
    });
    if (dump) {
      await prisma.project.update({
        where: { id: dump.id },
        data: { 
          image: '/projects/dump-final.png',
          link: 'https://dump.media' 
        },
      });
      console.log('✅ Updated Dump image and link');
    } else {
      console.log('⚠️ Dump not found');
    }
  } catch (e) {
    console.error('Error updating Dump:', e);
  }

  // Update Lettus
  try {
    const lettus = await prisma.project.findFirst({
      where: { title: { contains: 'Lettus', mode: 'insensitive' } },
    });
    if (lettus) {
      await prisma.project.update({
        where: { id: lettus.id },
        data: { link: 'https://lettus.fun' },
      });
      console.log('✅ Updated Lettus link');
    } else {
      console.log('⚠️ Lettus not found');
    }
  } catch (e) {
    console.error('Error updating Lettus:', e);
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
