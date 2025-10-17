const express = require('express')
const { authMiddleware, roleMiddleware } = require('../middleware/auth')
const { apiLimiter } = require('../middleware/rateLimiter')
const { getPendingApprovals, approveUser, rejectUser } = require('../controllers/approvalController')

const router = express.Router()

// Apply middleware
router.use(apiLimiter)
router.use(authMiddleware)
router.use(roleMiddleware(['ADMIN', 'MANAGER']))

// Routes
router.get('/pending', getPendingApprovals)
router.post('/:userId/approve', approveUser)
router.post('/:userId/reject', rejectUser)

module.exports = router