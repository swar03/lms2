const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

// Simple registration - creates student by default
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'Email, password, and full name are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user as student by default
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        fullName,
        roles: ['STUDENT'],
        status: 'PENDING'
      }
    });

    // Generate token
    const token = jwt.sign({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({ 
      success: true,
      token, 
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.roles[0] || 'STUDENT',
        status: user.status
      },
      message: 'Registration successful! Please complete your profile.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Simple login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ 
      id: user.id, 
      email: user.email, 
      role: user.roles[0] || 'STUDENT'
    }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      success: true,
      token, 
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.roles[0] || 'STUDENT',
        status: user.status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, fullName: true, roles: true, status: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        ...user,
        role: user.roles[0] || 'STUDENT'
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});



// Test authentication
router.post('/test', (req, res) => {
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

// Student profile completion
router.post('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { mobile, city, organization, linkedin } = req.body;
    
    const user = await prisma.user.update({
      where: { id: decoded.id },
      data: {
        mobile,
        city,
        organization,
        linkedin,
        status: 'APPROVED' // Auto-approve for now
      },
      select: { id: true, email: true, fullName: true, roles: true, status: true }
    });

    // Create welcome notification
    await prisma.notification.create({
      data: {
        recipientId: user.id,
        type: 'SYSTEM',
        message: 'Welcome to CyberLMS! Your profile is complete and you now have access to all courses.'
      }
    });

    res.json({ 
      success: true,
      user: {
        ...user,
        role: user.roles[0] || 'STUDENT'
      },
      message: 'Profile completed successfully! You now have access to all courses.'
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Profile update failed', error: error.message });
  }
});

// Get pending profiles for manager approval
router.get('/profiles/pending', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'MANAGER' && decoded.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const pendingProfiles = await prisma.user.findMany({
      where: {
        roles: { has: 'STUDENT' },
        status: 'PENDING'
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(pendingProfiles);
  } catch (error) {
    console.error('Get pending profiles error:', error);
    res.status(500).json({ message: 'Failed to get pending profiles' });
  }
});

// Approve student profile
router.post('/profiles/:userId/approve', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'MANAGER' && decoded.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { userId } = req.params;

    // Update user profile to approved
    const user = await prisma.user.update({
      where: { id: userId },
      data: { status: 'APPROVED' },
      select: { id: true, email: true, fullName: true }
    });

    // Get all courses for auto-enrollment
    const courses = await prisma.course.findMany({
      select: { id: true, title: true }
    });

    // Note: Enrollment logic can be added here if needed

    // Notify student of approval
    await prisma.notification.create({
      data: {
        recipientId: userId,
        type: 'APPROVAL',
        message: 'Your profile has been approved! You now have access to all course modules.'
      }
    });

    res.json({ message: 'Profile approved and courses unlocked', user });
  } catch (error) {
    console.error('Profile approval error:', error);
    res.status(500).json({ message: 'Profile approval failed' });
  }
});

module.exports = router;