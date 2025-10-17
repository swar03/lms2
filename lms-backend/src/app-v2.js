const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { PrismaClient } = require('@prisma/client')
const { applySoftDeleteMiddleware, applyAuditMiddleware } = require('./middleware/prisma-middleware')
const errorHandler = require('./middleware/errorHandler')

// Import routes
const authRoutes = require('./routes/auth-v2')
const approvalRoutes = require('./routes/approvals')
const notificationRoutes = require('./routes/notifications-v2')
const userRoutes = require('./routes/userRoutes')
const courseRoutes = require('./routes/courseRoutes')
const moduleRoutes = require('./routes/moduleRoutes')
const lectureRoutes = require('./routes/lectureRoutes')
const quizRoutes = require('./routes/quizRoutes')
const assignmentRoutes = require('./routes/assignmentRoutes')

const app = express()
const prisma = new PrismaClient()

// Apply Prisma middleware (disabled for now due to compatibility issues)
// applySoftDeleteMiddleware(prisma)
// applyAuditMiddleware(prisma)

// Security middleware
app.use(helmet())
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Trust proxy for rate limiting
app.set('trust proxy', 1)

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'LMS Backend is running',
    timestamp: new Date().toISOString()
  })
})

// API routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/approvals', approvalRoutes)
app.use('/api/v1/notifications', notificationRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/courses', courseRoutes)
app.use('/api/v1/modules', moduleRoutes)
app.use('/api/v1/lectures', lectureRoutes)
app.use('/api/v1/quizzes', quizRoutes)
app.use('/api/v1/assignments', assignmentRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Error handler
app.use(errorHandler)

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`🚀 LMS Backend running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
}).on('error', (err) => {
  console.error('Server error:', err)
})

module.exports = app