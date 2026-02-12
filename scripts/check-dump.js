
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Checking Dump project state...');
  const dump = await prisma.project.findFirst({
    where: { title: { contains: 'Dump', mode: 'insensitive' } },
  });
  console.log('Dump Project:', dump);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
