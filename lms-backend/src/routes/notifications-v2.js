const express = require('express')
const { authMiddleware } = require('../middleware/auth')
const { apiLimiter } = require('../middleware/rateLimiter')
const { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} = require('../controllers/notificationController')

const router = express.Router()

// Apply middleware
router.use(apiLimiter)
router.use(authMiddleware)

// Routes
router.get('/', getNotifications)
router.post('/:notificationId/read', markAsRead)
router.post('/mark-all-read', markAllAsRead)
router.delete('/:notificationId', deleteNotification)

module.exports = router