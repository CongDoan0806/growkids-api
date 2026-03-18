import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('12345678', 10);

  await prisma.admin.upsert({
    where: { email: 'huyen.admin@growkids.com' },
    update: {},
    create: {
      email: 'admin@growkids.com',
      password: hashedPassword,
      fullName: 'AdminGrowkid',
      status: 'ACTIVE',
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
