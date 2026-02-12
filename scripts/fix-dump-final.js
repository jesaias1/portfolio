
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Forcing Dump image update to FIXED version...');

  try {
    const dump = await prisma.project.findFirst({
      where: { title: { contains: 'Dump', mode: 'insensitive' } },
    });
    
    if (dump) {
      await prisma.project.update({
        where: { id: dump.id },
        data: { 
          image: '/projects/dump-fixed.png'
        },
      });
      console.log('✅ Updated Dump image to: /projects/dump-fixed.png');
    } else {
      console.log('⚠️ Dump not found!');
    }
  } catch (e) {
    console.error('Error:', e);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
