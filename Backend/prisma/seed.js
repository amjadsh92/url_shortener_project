const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const exists = await prisma.counter.findUnique({ where: { id: 1 } });

  if (!exists) {
    await prisma.counter.create({
      data: { id: 1, count: 0 },
    });
    console.log("Counter initialized.");
  } else {
    console.log("Counter already initialized.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
