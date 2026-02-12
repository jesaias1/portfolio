const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Updating dump.media image...');
  
  try {
    const dump = await prisma.project.findFirst({
      where: { title: { contains: 'Dump', mode: 'insensitive' } },
    });
    
    if (dump) {
      await prisma.project.update({
        where: { id: dump.id },
        data: { 
          image: '/projects/dump-media.png',
        },
      });
      console.log('✅ Updated Dump image to dump-media.png');
      console.log('  Previous:', dump.image);
      console.log('  New: /projects/dump-media.png');
    } else {
      console.log('⚠️ Dump project not found in database');
    }
  } catch (e) {
    console.error('Error:', e);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
