const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllQuizzes = async (req, res) => {
  const quizzes = await prisma.quiz.findMany({
    include: { submissions: true }
  });
  res.json(quizzes);
};
