const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Auth middleware
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    
    if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    req.user = user;
    next();
  });
};

// Get all students
router.get('/students', authenticateAdmin, async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: {
        roles: { has: 'STUDENT' }
      },
      include: {
        profile: true,
        approvals: {
          include: {
            actor: {
              select: { fullName: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      students
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
});

// Get pending students
router.get('/students/pending', authenticateAdmin, async (req, res) => {
  try {
    const pendingStudents = await prisma.user.findMany({
      where: {
        roles: { has: 'STUDENT' },
        status: 'PENDING'
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        mobile: true,
        emailVerified: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      students: pendingStudents
    });
  } catch (error) {
    console.error('Get pending students error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending students' });
  }
});

// Approve student
router.post('/students/:id/approve', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    const student = await prisma.user.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedById: req.user.id
      }
    });

    // Create approval record
    await prisma.approval.create({
      data: {
        userId: id,
        actorId: req.user.id,
        status: 'APPROVED',
        note: note || 'Approved by admin',
        ipAddress: req.ip
      }
    });

    // Create notification for student
    await prisma.notification.create({
      data: {
        recipientId: id,
        type: 'APPROVAL',
        message: `✅ Your account has been approved by ${req.user.fullName || 'Admin'}! You now have full access to all courses.`
      }
    });

    // Notify other admins
    const otherAdmins = await prisma.user.findMany({
      where: {
        OR: [
          { roles: { has: 'ADMIN' } },
          { roles: { has: 'MANAGER' } }
        ],
        NOT: { id: req.user.id }
      }
    });

    await Promise.all(
      otherAdmins.map(admin =>
        prisma.notification.create({
          data: {
            recipientId: admin.id,
            type: 'SYSTEM',
            message: `${student.fullName || student.email} was approved by ${req.user.fullName || 'Admin'}.`
          }
        })
      )
    );

    res.json({
      success: true,
      message: 'Student approved successfully',
      student
    });
  } catch (error) {
    console.error('Approve student error:', error);
    res.status(500).json({ success: false, message: 'Failed to approve student' });
  }
});

// Reject student
router.post('/students/:id/reject', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const student = await prisma.user.update({
      where: { id },
      data: {
        status: 'REJECTED',
        approvalNote: reason
      }
    });

    // Create approval record
    await prisma.approval.create({
      data: {
        userId: id,
        actorId: req.user.id,
        status: 'REJECTED',
        note: reason || 'Rejected by admin',
        ipAddress: req.ip
      }
    });

    // Create notification for student
    await prisma.notification.create({
      data: {
        recipientId: id,
        type: 'APPROVAL',
        message: `❌ Your account application has been rejected. Reason: ${reason || 'Not specified'}`
      }
    });

    // Notify other admins
    const otherAdmins = await prisma.user.findMany({
      where: {
        OR: [
          { roles: { has: 'ADMIN' } },
          { roles: { has: 'MANAGER' } }
        ],
        NOT: { id: req.user.id }
      }
    });

    await Promise.all(
      otherAdmins.map(admin =>
        prisma.notification.create({
          data: {
            recipientId: admin.id,
            type: 'SYSTEM',
            message: `${student.fullName || student.email} was rejected by ${req.user.fullName || 'Admin'}.`
          }
        })
      )
    );

    res.json({
      success: true,
      message: 'Student rejected',
      student
    });
  } catch (error) {
    console.error('Reject student error:', error);
    res.status(500).json({ success: false, message: 'Failed to reject student' });
  }
});

// Change student status
router.post('/students/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const student = await prisma.user.update({
      where: { id },
      data: { status, approvedById: status === 'APPROVED' ? req.user.id : null }
    });

    // Create approval record
    await prisma.approval.create({
      data: {
        userId: id,
        actorId: req.user.id,
        status: status === 'APPROVED' ? 'APPROVED' : status === 'REJECTED' ? 'REJECTED' : 'PENDING',
        note: note || `Status changed to ${status}`,
        ipAddress: req.ip
      }
    });

    // Notify student
    const message = status === 'APPROVED' 
      ? '✅ Your account has been approved! You now have full access to all courses.'
      : status === 'REJECTED'
      ? '❌ Your account application has been rejected.'
      : 'Your account status has been updated to pending.';

    await prisma.notification.create({
      data: {
        recipientId: id,
        type: 'APPROVAL',
        message
      }
    });

    res.json({ success: true, message: 'Status updated successfully', student });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

// Get admin dashboard stats
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const [totalStudents, pendingStudents, approvedStudents, totalCourses] = await Promise.all([
      prisma.user.count({ where: { roles: { has: 'STUDENT' } } }),
      prisma.user.count({ where: { roles: { has: 'STUDENT' }, status: 'PENDING' } }),
      prisma.user.count({ where: { roles: { has: 'STUDENT' }, status: 'APPROVED' } }),
      prisma.course.count()
    ]);

    res.json({
      success: true,
      stats: {
        totalStudents,
        pendingStudents,
        approvedStudents,
        totalCourses
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
});

module.exports = router;