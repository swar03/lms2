// servers/src/middleware/educatorAuth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const educatorAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token missing or malformed.' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Allow if the user is either an EDUCATOR or an ADMIN
    if (decoded.role !== 'EDUCATOR' && decoded.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Access is restricted to educators and administrators.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed: Invalid token.' });
  }
};

module.exports = educatorAuthMiddleware;