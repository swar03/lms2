const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Get user notifications
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 50
    const skip = (page - 1) * limit

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: userId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    const unreadCount = await prisma.notification.count({
      where: {
        recipientId: userId,
        read: false,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      }
    })

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          page,
          limit,
          total: notifications.length
        }
      }
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    })
  }
}

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params
    const userId = req.user.id

    await prisma.notification.updateMany({
      where: {
        id: notificationId,
        recipientId: userId
      },
      data: { read: true }
    })

    res.json({
      success: true,
      message: 'Notification marked as read'
    })
  } catch (error) {
    console.error('Mark notification as read error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    })
  }
}

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id

    await prisma.notification.updateMany({
      where: {
        recipientId: userId,
        read: false
      },
      data: { read: true }
    })

    res.json({
      success: true,
      message: 'All notifications marked as read'
    })
  } catch (error) {
    console.error('Mark all notifications as read error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    })
  }
}

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params
    const userId = req.user.id

    await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        recipientId: userId
      }
    })

    res.json({
      success: true,
      message: 'Notification deleted'
    })
  } catch (error) {
    console.error('Delete notification error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    })
  }
}

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
}