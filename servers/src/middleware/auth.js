const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token missing or malformed.' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach user payload (id, role) to the request object
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed: Invalid token.' });
  }
};

module.exports = authMiddleware;