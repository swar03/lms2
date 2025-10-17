// src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// AdminJS Setup
try {
  const { adminRouter } = require('./admin');
  app.use('/admin', adminRouter);
  console.log('✅ AdminJS loaded successfully at /admin');
} catch (error) {
  console.log('⚠️  AdminJS not available:', error.message);
}

// Database connection check
let dbConnected = false;
try {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  // Test database connection
  prisma.$connect()
    .then(() => {
      console.log('✅ Database connected successfully');
      dbConnected = true;
    })
    .catch((error) => {
      console.log('⚠️  Database connection failed:', error.message);
      console.log('📝 Server will run without database features');
    });
} catch (error) {
  console.log('⚠️  Prisma client error:', error.message);
  console.log('📝 Server will run in basic mode');
}

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'LMS Backend Running!', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes - with error handling
let authRoutes, dashboardRoutes, userRoutes, courseRoutes, moduleRoutes;
let lectureRoutes, assignmentRoutes, quizRoutes, workflowRoutes;
let notificationRoutes, enrollmentRoutes;

try {
  authRoutes = require('./routes/auth');
  dashboardRoutes = require('./routes/dashboardRoutes');
  userRoutes = require('./routes/userRoutes');
  courseRoutes = require('./routes/courseRoutes');
  moduleRoutes = require('./routes/moduleRoutes');
  lectureRoutes = require('./routes/lectureRoutes');
  assignmentRoutes = require('./routes/assignmentRoutes');
  quizRoutes = require('./routes/quizRoutes');
  workflowRoutes = require('./routes/workflow');
  notificationRoutes = require('./routes/notifications');
  enrollmentRoutes = require('./routes/enrollmentRoutes');
  console.log('✅ All routes loaded successfully');
} catch (error) {
  console.error('❌ Route loading error:', error.message);
  console.log('📝 Creating fallback routes...');
  
  // Create minimal fallback routes
  const router = require('express').Router();
  router.all('*', (req, res) => {
    res.status(503).json({ 
      message: 'Service temporarily unavailable', 
      error: 'Database or route configuration issue'
    });
  });
  
  authRoutes = dashboardRoutes = userRoutes = courseRoutes = moduleRoutes = 
  lectureRoutes = assignmentRoutes = quizRoutes = workflowRoutes = 
  notificationRoutes = enrollmentRoutes = router;
}

// Mount routes
app.use('/api', authRoutes);                    // /api/login, /api/register, /api/auth/*
app.use('/api/dashboard', dashboardRoutes);     // /api/dashboard/admin, /api/dashboard/manager, /api/dashboard/student
app.use('/api/users', userRoutes);              // /api/users
app.use('/api/courses', courseRoutes);          // /api/courses
app.use('/api/modules', moduleRoutes);          // /api/modules
app.use('/api/lectures', lectureRoutes);        // /api/lectures
app.use('/api/assignments', assignmentRoutes);  // /api/assignments
app.use('/api/quizzes', quizRoutes);            // /api/quizzes
app.use('/api', workflowRoutes);                // /api/submit, /api/submissions/*
app.use('/api', notificationRoutes);            // /api/notifications
app.use('/api', enrollmentRoutes);              // /api/enrollments

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Validation Error', 
      details: error.message 
    });
  }
  
  if (error.code === 'P2002') {
    return res.status(409).json({ 
      message: 'Duplicate entry', 
      details: 'A record with this data already exists'
    });
  }
  
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Process error handlers
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.log('🔄 Server will continue running...');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  console.log('🔄 Server will continue running...');
});

const PORT = process.env.PORT || 3000;

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`🚀 LMS Backend Server started on port ${port}`);
    console.log(`📍 Health check: http://localhost:${port}`);
    console.log(`📚 API Base URL: http://localhost:${port}/api`);
    console.log(`🛠️ Admin Panel: http://localhost:5173/simple-admin`);
    console.log('✅ Server is ready for connections!');
    console.log('\n🔑 Admin Login:');
    console.log('   Email: admin@lms.com');
    console.log('   Password: password123');
    console.log('\n🔑 Test Accounts:');
    console.log('   Manager: manager@lms.com / password123');
    console.log('   Student: student@test.com / password123');
    
    console.log('\n📋 Key Endpoints:');
    console.log('   POST /api/login - Email/password login');
    console.log('   POST /api/register - Register student');
    console.log('   GET /api/courses - List courses');
    console.log('   POST /api/enrollments - Enroll in course');
    console.log('   GET /api/notifications - Get notifications');
    console.log('   GET /api/dashboard/student - Student dashboard');
    console.log('   GET /api/dashboard/manager - Manager dashboard');
    
    console.log('\n📝 Press Ctrl+C to stop the server');
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = parseInt(port) + 1;
      console.log(`⚠️  Port ${port} is busy, trying port ${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error('❌ Server error:', error.message);
      process.exit(1);
    }
  });
  
  return server;
}

startServer(PORT);

module.exports = app;