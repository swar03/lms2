const express = require('express');
const router = express.Router();
const { authorizeRoles } = require('../middleware/rbac');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get unread notifications for the logged-in user
router.get('/notifications', authorizeRoles(['MANAGER', 'STUDENT', 'ADMIN']), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const notifications = await prisma.notification.findMany({
            where: { userId, read: false },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ notifications });
    } catch (err) {
        next(err);
    }
});

// Mark notification as read
router.post('/notifications/read', authorizeRoles(['MANAGER', 'STUDENT', 'ADMIN']), async (req, res, next) => {
    try {
        const { notificationId } = req.body;
        await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true }
        });
        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
