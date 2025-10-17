const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seedAdminUsers() {
  const hash = await bcrypt.hash('password123', 10);

  // Create Admin
  await prisma.user.upsert({
    where: { email: 'admin@lms.com' },
    update: {},
    create: {
      email: 'admin@lms.com',
      fullName: 'System Admin',
      passwordHash: hash,
      roles: ['ADMIN'],
      status: 'APPROVED',
      emailVerified: true
    }
  });

  // Create Manager
  await prisma.user.upsert({
    where: { email: 'manager@lms.com' },
    update: {},
    create: {
      email: 'manager@lms.com',
      fullName: 'Course Manager',
      passwordHash: hash,
      roles: ['MANAGER'],
      status: 'APPROVED',
      emailVerified: true
    }
  });

  console.log('✅ Admin and Manager accounts created');
  console.log('📧 admin@lms.com / password123');
  console.log('📧 manager@lms.com / password123');
}

seedAdminUsers()
  .catch(console.error)
  .finally(() => prisma.$disconnect());