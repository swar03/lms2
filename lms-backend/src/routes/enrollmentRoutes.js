const express = require('express');
const router = express.Router();
const { authorizeRoles } = require('../middleware/rbac');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Manager: list pending enrollments for courses they manage
router.get('/enrollments/pending', authorizeRoles(['MANAGER', 'ADMIN']), async (req, res) => {
  try {
    const userId = req.user.id;
    const courses = await prisma.course.findMany({ where: { managerId: userId }, select: { id: true } });
    const courseIds = courses.map(c => c.id);
    const enrollments = await prisma.enrollment.findMany({
      where: { status: 'PENDING', courseId: { in: courseIds } },
      include: { student: true, course: true }
    });
    res.json({ enrollments });
  } catch {
    res.status(500).json({ message: 'Failed to fetch pending enrollments' });
  }
});

// Manager: approve
router.post('/enrollments/:id/approve', authorizeRoles(['MANAGER', 'ADMIN']), async (req, res) => {
  try {
    const enrollment = await prisma.enrollment.update({
      where: { id: req.params.id },
      data: { status: 'APPROVED' },
      include: { student: true, course: true }
    });

    // Notify student
    await prisma.notification.create({
      data: {
        userId: enrollment.studentId,
        type: 'APPROVAL',
        message: `Your enrollment for ${enrollment.course.title} was approved`
      }
    });

    res.json({ enrollment });
  } catch {
    res.status(404).json({ message: 'Enrollment not found' });
  }
});

// Manager: deny
router.post('/enrollments/:id/deny', authorizeRoles(['MANAGER', 'ADMIN']), async (req, res) => {
  try {
    const enrollment = await prisma.enrollment.update({
      where: { id: req.params.id },
      data: { status: 'DENIED' },
      include: { student: true, course: true }
    });

    // Notify student
    await prisma.notification.create({
      data: {
        userId: enrollment.studentId,
        type: 'APPROVAL',
        message: `Your enrollment for ${enrollment.course.title} was denied`
      }
    });

    res.json({ enrollment });
  } catch {
    res.status(404).json({ message: 'Enrollment not found' });
  }
});

module.exports = router;