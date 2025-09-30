const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllCourses = async (req, res) => {
  const courses = await prisma.course.findMany({ include: { modules: true } });
  res.json(courses);
};
