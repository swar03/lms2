const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function approveUser(email) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { status: 'APPROVED' }
    });
    
    console.log('✅ User approved:', user.email);
    console.log('Status:', user.status);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node approve-user.js <email>');
  console.log('Example: node approve-user.js student@test.com');
  process.exit(1);
}

approveUser(email);
