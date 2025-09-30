const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
};
