const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllLectures = async (req, res) => {
  const lectures = await prisma.lecture.findMany();
  res.json(lectures);
};
