// Input validation middleware
const validateRegistration = (req, res, next) => {
  const { fullName, email, mobile, password } = req.body;
  const errors = [];

  if (!fullName || fullName.trim().length < 2) {
    errors.push('Full name must be at least 2 characters');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email is required');
  }

  if (!mobile || !/^\d{10,15}$/.test(mobile.replace(/[\s-]/g, ''))) {
    errors.push('Valid mobile number is required (10-15 digits)');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(', ') });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(', ') });
  }

  next();
};

const validateOTP = (req, res, next) => {
  const { email, otp } = req.body;
  const errors = [];

  if (!email) {
    errors.push('Email is required');
  }

  if (!otp || !/^\d{6}$/.test(otp)) {
    errors.push('Valid 6-digit OTP is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(', ') });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateOTP
};