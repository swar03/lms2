const express = require('express');
const router = express.Router();
const { authorizeRoles } = require('../middleware/rbac');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get notifications for the logged-in user (with optional filtering)
router.get('/notifications', authorizeRoles(['MANAGER', 'STUDENT', 'ADMIN']), async (req, res) => {
    try {
        const userId = req.user.id;
        const { unreadOnly = 'false', limit = '50' } = req.query;
        
        const whereClause = { userId };
        if (unreadOnly === 'true') {
            whereClause.read = false;
        }
        
        const notifications = await prisma.notification.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit)
        });
        
        const unreadCount = await prisma.notification.count({
            where: { userId, read: false }
        });
        
        res.json({ notifications, unreadCount });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ message: 'Failed to fetch notifications' });
    }
});

// Mark single notification as read
router.post('/notifications/:id/read', authorizeRoles(['MANAGER', 'STUDENT', 'ADMIN']), async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user.id;
        
        const notification = await prisma.notification.findFirst({
            where: { id: notificationId, userId }
        });
        
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        
        await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true }
        });
        
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Mark notification read error:', error);
        res.status(500).json({ message: 'Failed to mark notification as read' });
    }
});

// Mark all notifications as read
router.post('/notifications/read-all', authorizeRoles(['MANAGER', 'STUDENT', 'ADMIN']), async (req, res) => {
    try {
        const userId = req.user.id;
        
        const result = await prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true }
        });
        
        res.json({ message: `${result.count} notifications marked as read` });
    } catch (error) {
        console.error('Mark all notifications read error:', error);
        res.status(500).json({ message: 'Failed to mark all notifications as read' });
    }
});

// Delete notification
router.delete('/notifications/:id', authorizeRoles(['MANAGER', 'STUDENT', 'ADMIN']), async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user.id;
        
        const notification = await prisma.notification.findFirst({
            where: { id: notificationId, userId }
        });
        
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        
        await prisma.notification.delete({
            where: { id: notificationId }
        });
        
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ message: 'Failed to delete notification' });
    }
});

module.exports = router;
