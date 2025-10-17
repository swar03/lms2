const express = require('express');
const router = express.Router();
const { authorizeRoles } = require('../middleware/rbac');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Student: enroll in course (creates PENDING enrollment)
router.post('/enrollments', authorizeRoles(['STUDENT']), async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ message: 'courseId is required' });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, managerId: true }
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const enrollment = await prisma.enrollment.upsert({
      where: { studentId_courseId: { studentId, courseId } },
      update: { status: 'PENDING' },
      create: { studentId, courseId, status: 'PENDING' },
      include: { student: true, course: true }
    });

    // Create notification for manager
    await prisma.notification.create({
      data: {
        userId: course.managerId,
        type: 'ENROLLMENT_REQUEST',
        message: `${enrollment.student.fullName} requested enrollment in ${course.title}`
      }
    });

    res.json({ enrollment, message: 'Enrollment request submitted' });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ message: 'Failed to create enrollment' });
  }
});

// Manager: list pending enrollments for courses they manage
router.get('/enrollments/pending', authorizeRoles(['MANAGER', 'ADMIN']), async (req, res) => {
  try {
    const userId = req.user.id;
    const whereClause = req.user.role === 'ADMIN' ? {} : { course: { managerId: userId } };
    
    const enrollments = await prisma.enrollment.findMany({
      where: { status: 'PENDING', ...whereClause },
      include: {
        student: { select: { id: true, fullName: true, email: true } },
        course: { select: { id: true, title: true, description: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ enrollments });
  } catch (error) {
    console.error('Fetch pending enrollments error:', error);
    res.status(500).json({ message: 'Failed to fetch pending enrollments' });
  }
});

// Student: get my enrollments
router.get('/enrollments/my', authorizeRoles(['STUDENT']), async (req, res) => {
  try {
    const studentId = req.user.id;
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            modules: {
              select: {
                id: true,
                title: true,
                order: true,
                lectures: { select: { id: true, title: true } },
                assignments: { select: { id: true, title: true } },
                quizzes: { select: { id: true, title: true } }
              },
              orderBy: { order: 'asc' }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ enrollments });
  } catch (error) {
    console.error('Fetch my enrollments error:', error);
    res.status(500).json({ message: 'Failed to fetch enrollments' });
  }
});

// Manager: approve enrollment
router.post('/enrollments/:id/approve', authorizeRoles(['MANAGER', 'ADMIN']), async (req, res) => {
  try {
    const enrollmentId = req.params.id;
    
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { student: true, course: true }
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check if manager owns this course (unless admin)
    if (req.user.role === 'MANAGER' && enrollment.course.managerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to approve this enrollment' });
    }

    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { status: 'APPROVED' },
      include: { student: true, course: true }
    });

    // Notify student of approval
    await prisma.notification.create({
      data: {
        userId: enrollment.studentId,
        type: 'ENROLLMENT_APPROVED',
        message: `Your enrollment for "${enrollment.course.title}" has been approved! You can now access the course.`
      }
    });

    res.json({ enrollment: updatedEnrollment, message: 'Enrollment approved successfully' });
  } catch (error) {
    console.error('Approve enrollment error:', error);
    res.status(500).json({ message: 'Failed to approve enrollment' });
  }
});

// Manager: deny enrollment
router.post('/enrollments/:id/deny', authorizeRoles(['MANAGER', 'ADMIN']), async (req, res) => {
  try {
    const enrollmentId = req.params.id;
    const { reason } = req.body;
    
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { student: true, course: true }
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check if manager owns this course (unless admin)
    if (req.user.role === 'MANAGER' && enrollment.course.managerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to deny this enrollment' });
    }

    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { status: 'DENIED' },
      include: { student: true, course: true }
    });

    // Notify student of denial
    const message = reason 
      ? `Your enrollment for "${enrollment.course.title}" was denied. Reason: ${reason}`
      : `Your enrollment for "${enrollment.course.title}" was denied.`;
      
    await prisma.notification.create({
      data: {
        userId: enrollment.studentId,
        type: 'ENROLLMENT_DENIED',
        message
      }
    });

    res.json({ enrollment: updatedEnrollment, message: 'Enrollment denied' });
  } catch (error) {
    console.error('Deny enrollment error:', error);
    res.status(500).json({ message: 'Failed to deny enrollment' });
  }
});

module.exports = router;