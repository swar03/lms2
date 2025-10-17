const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const { generateTokens } = require('../middleware/auth')
const { authLimiter } = require('../middleware/rateLimiter')

const router = express.Router()
const prisma = new PrismaClient()

// Apply rate limiting to auth routes (except test)
router.use('/register', authLimiter)
router.use('/login', authLimiter)
router.use('/refresh', authLimiter)

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user with STUDENT role by default
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        roles: ['STUDENT'],
        status: 'PENDING'
      }
    })

    // Create approval record
    await prisma.approval.create({
      data: {
        userId: user.id,
        status: 'PENDING',
        ipAddress: req.ip
      }
    })

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please complete your profile.',
      data: {
        userId: user.id,
        email: user.email,
        status: user.status
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    })
  }
})

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        admin: true,
        manager: true
      }
    })

    if (!user || !user.passwordHash || user.deletedAt) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Check if user is approved
    if (user.status !== 'APPROVED') {
      return res.status(403).json({
        success: false,
        message: 'Account pending approval',
        status: user.status
      })
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id)

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          roles: user.roles,
          status: user.status,
          profile: user.profile,
          isAdmin: !!user.admin,
          isManager: !!user.manager
        }
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Login failed'
    })
  }
})

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      })
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || user.deletedAt) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      })
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id)

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken
      }
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    })
  }
})

// Test authentication (development only - no auth required)
router.post('/test', async (req, res) => {
  try {
    const { email = 'test@example.com', role = 'STUDENT', fullName = 'Test User' } = req.body

    // Simple mock response without database
    const mockUser = {
      id: '1',
      email,
      fullName,
      role,
      roles: [role],
      status: 'APPROVED',
      profileComplete: true,
      profileApproved: true
    }

    const mockToken = 'mock-jwt-token-for-testing'

    res.json({
      success: true,
      token: mockToken,
      user: mockUser,
      message: 'Test login successful'
    })
  } catch (error) {
    console.error('Test auth error:', error)
    res.status(500).json({
      success: false,
      message: 'Test authentication failed'
    })
  }
})

module.exports = router