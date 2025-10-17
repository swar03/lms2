const express = require('express');
const cors = require('cors');
// Use simple auth (no email) for testing, or auth-email for production
const authRoutes = require('./routes/auth-simple'); // Change to auth-email when email is configured

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'LMS Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Login endpoint
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    const { PrismaClient } = require('@prisma/client');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    const { sendEmail } = require('./services/emailService');
    const prisma = new PrismaClient();
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });
    
    if (!user) {
      await prisma.$disconnect();
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      await prisma.$disconnect();
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check if email is verified
    if (!user.emailVerified) {
      await prisma.$disconnect();
      return res.status(403).json({
        success: false,
        message: 'Please verify your email address before logging in'
      });
    }
    
    // Check if account is approved
    if (user.status !== 'APPROVED') {
      await prisma.$disconnect();
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, roles: user.roles },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    // Send login notification email
    await sendEmail(email, 'loginNotification', { fullName: user.fullName });
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
        status: user.status,
        profile: user.profile
      }
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Mount auth routes
app.use('/api/v1/auth', authRoutes);

// Auth test endpoint
app.post('/api/v1/auth/test', (req, res) => {
  console.log('Auth test called with:', req.body);
  const { email = 'test@example.com', role = 'STUDENT', fullName = 'Test User' } = req.body;
  
  res.json({
    success: true,
    token: 'mock-jwt-token',
    user: {
      id: '1',
      email,
      fullName,
      role
    }
  });
});

// Registration endpoint - saves to PostgreSQL with email notification
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    console.log('Registration called with:', req.body);
    const { email, password, fullName, mobile, city, organization, linkedin } = req.body;
    
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and full name are required'
      });
    }
    
    const { PrismaClient } = require('@prisma/client');
    const bcrypt = require('bcrypt');
    const { sendEmail } = require('./services/emailService');
    const prisma = new PrismaClient();
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      await prisma.$disconnect();
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        mobile,
        city,
        organization,
        linkedin,
        roles: ['STUDENT'],
        status: 'PENDING',
        emailVerified: false,
        emailOTP: otp,
        otpExpiry
      }
    });
    
    // Send OTP email
    await sendEmail(email, 'emailOTP', { fullName, otp });
    
    res.json({
      success: true,
      message: 'Registration successful! Check your email for confirmation.',
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        status: newUser.status
      }
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Admin approve user endpoint
app.post('/api/v1/admin/approve-user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { PrismaClient } = require('@prisma/client');
    const { sendEmail } = require('./services/emailService');
    const prisma = new PrismaClient();
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { status: 'APPROVED' }
    });
    
    // Send approval email
    await sendEmail(user.email, 'accountApproved', { fullName: user.fullName });
    
    res.json({
      success: true,
      message: 'User approved successfully'
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve user',
      error: error.message
    });
  }
});

// Admin reject user endpoint
app.post('/api/v1/admin/reject-user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    await prisma.user.update({
      where: { id: userId },
      data: { status: 'REJECTED' }
    });
    
    res.json({
      success: true,
      message: 'User rejected successfully'
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Rejection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject user',
      error: error.message
    });
  }
});

// Resend OTP endpoint
app.post('/api/v1/auth/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    const { PrismaClient } = require('@prisma/client');
    const { sendEmail } = require('./services/emailService');
    const prisma = new PrismaClient();
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user || user.emailVerified) {
      await prisma.$disconnect();
      return res.status(400).json({
        success: false,
        message: 'Invalid request'
      });
    }
    
    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Update user with new OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailOTP: otp,
        otpExpiry
      }
    });
    
    // Send new OTP email
    await sendEmail(email, 'emailOTP', { fullName: user.fullName, otp });
    
    res.json({
      success: true,
      message: 'OTP sent successfully'
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP',
      error: error.message
    });
  }
});

// OTP verification endpoint
app.post('/api/v1/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }
    
    const { PrismaClient } = require('@prisma/client');
    const { sendEmail } = require('./services/emailService');
    const prisma = new PrismaClient();
    
    // Find user with email and OTP
    const user = await prisma.user.findFirst({
      where: { 
        email,
        emailOTP: otp,
        otpExpiry: {
          gt: new Date()
        }
      }
    });
    
    if (!user) {
      await prisma.$disconnect();
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }
    
    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailOTP: null,
        otpExpiry: null
      }
    });
    
    // Send welcome email after verification
    await sendEmail(user.email, 'welcome', { fullName: user.fullName });
    
    res.json({
      success: true,
      message: 'Email verified successfully! You can now log in.'
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'OTP verification failed',
      error: error.message
    });
  }
});

// User profile endpoint - with real database connection
app.get('/api/v1/users/profile', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // For now, get the first user (later this will use JWT to get current user)
    const user = await prisma.user.findFirst({
      include: {
        profile: true
      }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found'
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        mobile: user.mobile,
        city: user.city,
        organization: user.organization,
        linkedin: user.linkedin,
        roles: user.roles,
        status: user.status,
        profile: user.profile,
        createdAt: user.createdAt
      }
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

// Basic endpoints
app.get('/api/v1/courses', (req, res) => {
  res.json({ success: true, data: [] });
});

app.get('/api/v1/notifications', (req, res) => {
  res.json({ success: true, data: [] });
});

app.get('/api/v1/dashboard/:role', (req, res) => {
  res.json({ success: true, data: { stats: {}, recent: [] } });
});

app.get('/api/v1/users', (req, res) => {
  res.json({ success: true, data: [] });
});

app.get('/api/v1/submissions', (req, res) => {
  res.json({ success: true, data: [] });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Minimal LMS Backend running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Base URL: http://localhost:${PORT}/api/v1`);
  console.log('✅ Server ready for frontend testing!');
  console.log('\n🔄 Server is running... Press Ctrl+C to stop');
});

// Keep server alive
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});

// Prevent process from exiting
process.stdin.resume();

module.exports = app;