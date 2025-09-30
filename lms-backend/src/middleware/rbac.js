const jwt = require('jsonwebtoken');

function authorizeRoles(allowedRoles) {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Forbidden: Insufficient role' });
            }
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
}

module.exports = { authorizeRoles };
