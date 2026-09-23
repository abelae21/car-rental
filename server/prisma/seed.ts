import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@carrental.com';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log('Admin user already exists, skipping seed.');
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin123!', 12);

  await prisma.user.create({
    data: {
      firstName: 'Platform',
      lastName: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
      isEmailVerified: true,
      isActive: true,
    },
  });

  console.log(`Seeded admin user: ${adminEmail} / Admin123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
