const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const about = await prisma.about.findFirst();
  const projects = await prisma.project.findMany();

  console.log("--- ABOUT SECTION ---");
  // Use a replacer to handle nulls
  console.log(JSON.stringify(about, null, 2));

  console.log("\n--- PROJECTS ---");
  projects.forEach(p => {
    console.log(`Title: ${p.title}`);
    console.log(`Description: ${p.description}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
