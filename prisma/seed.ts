import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const hashedPassword = await bcrypt.hash('12345678', 10);

  const users = await Promise.all([
    prisma.users.upsert({
      where: { email: 'congdoan@gmail.com' },
      update: {},
      create: {
        fullName: 'Cong Doan',
        email: 'congdoan@gmail.com',
        password: hashedPassword,
        languagePreference: 'vi',
      },
    }),
    prisma.users.upsert({
      where: { email: 'tonga@gmail.com' },
      update: {},
      create: {
        fullName: 'Nguyen Thi To Nga',
        email: 'tonga@gmail.com',
        password: hashedPassword,
        languagePreference: 'vi',
      },
    }),
    prisma.users.upsert({
      where: { email: 'vandat@gmail.com' },
      update: {},
      create: {
        fullName: 'Nguyen Van Dat',
        email: 'vandat@gmail.com',
        password: hashedPassword,
        languagePreference: 'en',
      },
    }),
    prisma.users.upsert({
      where: { email: 'thithuy@gmail.com' },
      update: {},
      create: {
        fullName: 'Nguyen Thi Thuy',
        email: 'thithuy@gmail.com',
        password: hashedPassword,
        languagePreference: 'en',
      },
    }),
  ]);

  console.log('Seed completed!');
  console.log(`Created ${users.length} users`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
