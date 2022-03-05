const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { georgiaCounties } = require("../utils/consts");

async function main() {
  await prisma.county.deleteMany();
  await prisma.county.createMany({
    data: georgiaCounties.map((county) => ({
      name: county,
    })),
    skipDuplicates: true,
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
