const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllAssignments = async (req, res) => {
  const assignments = await prisma.assignment.findMany({
    include: { submissions: true }
  });
  res.json(assignments);
};
