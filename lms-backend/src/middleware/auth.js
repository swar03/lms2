const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        admin: true,
        manager: true,
        profile: true
      }
    })

    if (!user || user.deletedAt) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found.'
      })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.',
        code: 'TOKEN_EXPIRED'
      })
    }
    
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    })
  }
}

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      })
    }

    const userRoles = req.user.roles || []
    const hasPermission = allowedRoles.some(role => userRoles.includes(role))

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions.'
      })
    }

    next()
  }
}

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  )
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  )
  
  return { accessToken, refreshToken }
}

module.exports = {
  authMiddleware,
  roleMiddleware,
  generateTokens
}