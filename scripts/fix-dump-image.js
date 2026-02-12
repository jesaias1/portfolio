
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Forcing Dump image update...');

  try {
    const dump = await prisma.project.findFirst({
      where: { title: { contains: 'Dump', mode: 'insensitive' } },
    });
    
    if (dump) {
      console.log('Found Dump project:', dump.id);
      console.log('Current image:', dump.image);
      
      const updated = await prisma.project.update({
        where: { id: dump.id },
        data: { 
          image: '/projects/dump-v3.png' // New cache-busted path
        },
      });
      console.log('✅ Updated Dump image to:', updated.image);
    } else {
      console.log('⚠️ Dump not found in DB!');
    }
  } catch (e) {
    console.error('Error updating Dump:', e);
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
