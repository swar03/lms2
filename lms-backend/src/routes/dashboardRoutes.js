


const express = require('express');
const router = express.Router();
const { authorizeRoles } = require('../middleware/rbac');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Admin Dashboard
router.get('/admin', authorizeRoles(['ADMIN']), async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalCourses = await prisma.course.count();
    const totalSubmissions = await prisma.submission.count();
    
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, fullName: true, email: true, role: true, createdAt: true }
    });

    res.json({
      stats: {
        totalUsers,
        totalCourses,
        totalSubmissions
      },
      recentUsers
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Failed to fetch admin dashboard data' });
  }
});

// Manager Dashboard
router.get('/manager', authorizeRoles(['MANAGER']), async (req, res) => {
  try {
    const managerId = req.user.id;
    
    const managedCourses = await prisma.course.findMany({
      where: { managerId },
      include: {
        _count: {
          select: { 
            modules: true
          }
        }
      }
    });

    const recentSubmissions = await prisma.submission.findMany({
      where: {
        OR: [
          { assignment: { module: { course: { managerId } } } },
          { quiz: { module: { course: { managerId } } } }
        ]
      },
      include: {
        student: { select: { fullName: true } },
        assignment: { select: { title: true } },
        quiz: { select: { title: true } }
      },
      orderBy: { submittedAt: 'desc' },
      take: 10
    });

    const notifications = await prisma.notification.findMany({
      where: { userId: managerId, read: false },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const stats = {
      totalCourses: managedCourses.length,
      totalSubmissions: recentSubmissions.length
    };

    res.json({
      stats,
      managedCourses,
      recentSubmissions,
      notifications
    });
  } catch (error) {
    console.error('Manager dashboard error:', error);
    res.status(500).json({ message: 'Failed to fetch manager dashboard data' });
  }
});

// Student Dashboard
router.get('/student', authorizeRoles(['STUDENT']), async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Get all available courses (direct access)
    const courses = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            lectures: {
              select: {
                id: true,
                title: true,
                order: true
              },
              orderBy: { order: 'asc' }
            },
            assignments: {
              select: {
                id: true,
                title: true,
                description: true,
                taskUrl: true
              }
            },
            quizzes: {
              select: {
                id: true,
                title: true
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const certificates = await prisma.certificate.findMany({
      where: { userId: studentId },
      include: {
        course: { select: { title: true } },
        module: { select: { title: true } }
      },
      orderBy: { issuedAt: 'desc' }
    });

    const progress = await prisma.userProgress.findMany({
      where: { userId: studentId },
      include: {
        course: { select: { title: true } },
        module: { select: { title: true } },
        lecture: { select: { title: true } }
      }
    });

    const recentSubmissions = await prisma.submission.findMany({
      where: { studentId },
      include: {
        assignment: { select: { title: true } },
        quiz: { select: { title: true } }
      },
      orderBy: { submittedAt: 'desc' },
      take: 5
    });

    const notifications = await prisma.notification.findMany({
      where: { userId: studentId, read: false },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const stats = {
      totalCourses: courses.length,
      totalCertificates: certificates.length,
      completedProgress: progress.filter(p => p.completed).length,
      totalSubmissions: recentSubmissions.length
    };

    res.json({
      stats,
      courses,
      certificates,
      progress,
      recentSubmissions,
      notifications
    });
  } catch (error) {
    console.error('Student dashboard error:', error);
    res.status(500).json({ message: 'Failed to fetch student dashboard data' });
  }
});

module.exports = router;