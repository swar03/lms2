const { PrismaClient } = require('@prisma/client');

// This prevents creating new connections during hot-reloads in development
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;