const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token' });
    req.user = user;
    next();
  });
};

router.get('/admin', authenticate, async (req, res) => {
  try {
    const [totalUsers, totalCourses, totalSubmissions, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.submission.count(),
      prisma.user.findMany({ take: 10, orderBy: { createdAt: 'desc' } })
    ]);

    res.json({
      success: true,
      stats: { totalUsers, totalCourses, totalSubmissions },
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin dashboard' });
  }
});

router.get('/manager', authenticate, async (req, res) => {
  try {
    const [totalCourses, totalStudents] = await Promise.all([
      prisma.course.count(),
      prisma.user.count({ where: { roles: { has: 'STUDENT' } } })
    ]);

    res.json({
      success: true,
      stats: { totalCourses, totalStudents }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch manager dashboard' });
  }
});

router.get('/student', authenticate, async (req, res) => {
  try {
    const [enrollments, submissions] = await Promise.all([
      prisma.enrollment.count({ where: { userId: req.user.id } }),
      prisma.submission.count({ where: { userId: req.user.id } })
    ]);

    res.json({
      success: true,
      stats: { enrollments, submissions }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch student dashboard' });
  }
});

module.exports = router;
