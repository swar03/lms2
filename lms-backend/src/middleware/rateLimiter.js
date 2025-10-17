const rateLimit = require('express-rate-limit')

const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 20) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: 'Too many requests, please try again later.',
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
  })
}

const authLimiter = createRateLimiter(15 * 60 * 1000, 5) // 5 attempts per 15 minutes
const apiLimiter = createRateLimiter(15 * 60 * 1000, 20) // 20 requests per 15 minutes

module.exports = {
  createRateLimiter,
  authLimiter,
  apiLimiter
}