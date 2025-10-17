const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Simple Registration (No Email Verification)
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, mobile, password } = req.body;
    
    if (!fullName || !email || !mobile || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        mobile,
        passwordHash,
        roles: ['STUDENT'],
        status: 'APPROVED',
        emailVerified: true // Auto-verify for testing
      }
    });

    const token = jwt.sign({ 
      id: user.id, 
      email: user.email, 
      role: 'STUDENT'
    }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      success: true,
      message: 'Registration successful! You can now login.',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: 'STUDENT'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ 
      id: user.id, 
      email: user.email, 
      role: user.roles[0]
    }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      success: true,
      token, 
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.roles[0]
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

module.exports = router;