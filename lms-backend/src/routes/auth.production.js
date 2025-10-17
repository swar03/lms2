const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const emailService = require('../services/nodemailer.service');
const { validateRegistration, validateLogin, validateOTP } = require('../middleware/validate');

const prisma = new PrismaClient();

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.roles[0] },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ==================== STUDENT REGISTRATION ====================
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { fullName, email, mobile, password } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered. Please login or use a different email.'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        mobile,
        passwordHash,
        roles: ['STUDENT'],
        status: 'PENDING',
        emailVerified: false,
        emailOTP: otp,
        otpExpiry
      }
    });

    // Notify admins about new registration
    const admins = await prisma.user.findMany({
      where: {
        OR: [
          { roles: { has: 'ADMIN' } },
          { roles: { has: 'MANAGER' } }
        ]
      }
    });

    await Promise.all(
      admins.map(admin =>
        prisma.notification.create({
          data: {
            recipientId: admin.id,
            type: 'NEW_USER',
            message: `👤 New student registered: ${fullName} (${email})`
          }
        })
      )
    );

    // Send OTP email
    const emailResult = await emailService.sendOTPEmail(email, otp, fullName);
    
    if (!emailResult.success) {
      console.warn('Email send failed, but user created. OTP:', otp);
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for the verification OTP.',
      userId: user.id,
      email: user.email,
      // Include OTP in response for development (remove in production)
      ...(process.env.NODE_ENV === 'development' && { devOTP: otp })
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
});

// ==================== VERIFY EMAIL WITH OTP ====================
router.post('/verify-otp', validateOTP, async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified. Please login.'
      });
    }

    if (user.emailOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please check and try again.'
      });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired. Please request a new one.',
        expired: true
      });
    }

    // Verify user - keep status as PENDING for admin approval
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailOTP: null,
        otpExpiry: null
      }
    });

    // Send welcome email
    await emailService.sendWelcomeEmail(email, user.fullName);

    res.json({
      success: true,
      message: 'Email verified successfully! You can now login. Your account will be activated once approved by an administrator.'
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Verification failed. Please try again.'
    });
  }
});

// ==================== RESEND OTP ====================
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { emailOTP: otp, otpExpiry }
    });

    // Send OTP
    await emailService.sendOTPEmail(email, otp, user.fullName);

    res.json({
      success: true,
      message: 'OTP resent successfully. Please check your email.',
      ...(process.env.NODE_ENV === 'development' && { devOTP: otp })
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP'
    });
  }
});

// ==================== LOGIN (ALL ROLES) ====================
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check email verification for students
    if (user.roles.includes('STUDENT') && !user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in',
        needsVerification: true,
        email: user.email
      });
    }

    // Get profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    });

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.roles[0],
        emailVerified: user.emailVerified,
        profile
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
});

// ==================== GET CURRENT USER ====================
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        mobile: true,
        roles: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        profile: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        mobile: user.mobile,
        role: user.roles[0],
        status: user.status,
        emailVerified: user.emailVerified,
        profile: user.profile
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
});

module.exports = router;