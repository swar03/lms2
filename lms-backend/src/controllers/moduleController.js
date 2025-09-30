const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllModules = async (req, res) => {
  const modules = await prisma.module.findMany({
    include: {
      lectures: true,
      assignments: true,
      quizzes: true
    }
  });
  res.json(modules);
};
