const express = require('express');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Find or Create User (for Google OAuth)
router.post('/auth/google', async (req, res) => {
  const { googleId, email, name, profilePicture } = req.body;

  if (!googleId || !email || !name) {
    return res.status(400).json({ message: 'Missing required fields: googleId, email, name.' });
  }

  try {
    let user = await prisma.user.findUnique({
      where: { googleId },
    });

    if (!user) {
      // User does not exist, create a new one
      user = await prisma.user.create({
        data: {
          googleId,
          email,
          name,
          profilePicture,
          role: 'STUDENT', // Default role on first sign-up
        },
      });
    } else {
      // User exists, update their last login time
      user = await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });
    }

    // Sign a JWT token for the user session
    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' } // Token valid for 7 days
    );

    res.status(200).json({
      message: 'Authentication successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      },
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    // Check for unique constraint violation on email
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return res.status(409).json({ message: 'An account with this email already exists but is not linked to this Google account.' });
    }
    res.status(500).json({ message: 'Internal server error during authentication.' });
  }
});

module.exports = router;