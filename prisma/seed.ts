import { hashPassword } from "../lib/crypto";
import prisma from "../lib/prisma";

async function main() {
  const defaultPassword = await hashPassword("password123");

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "alice@prisma.io" },
      update: { password: defaultPassword },
      create: {
        email: "alice@prisma.io",
        password: defaultPassword,
        emailVerifid: false,
      },
    }),
    prisma.user.upsert({
      where: { email: "bob@prisma.io" },
      update: { password: defaultPassword },
      create: {
        email: "bob@prisma.io",
        password: defaultPassword,
        emailVerifid: false,
      },
    }),
  ]);

  console.log(`Seeded ${users.length} users.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
