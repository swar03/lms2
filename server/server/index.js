const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

// Helper function to generate a unique user ID
const generateUniqueUserId = (role, fullName) => {
  const sanitizedName = fullName.replace(/[^A-Za-z]/g, '').toUpperCase().substring(0, 3);
  const roleCode = role.substring(0, 3).toUpperCase();
  const year = new Date().getFullYear();
  const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${roleCode}-${sanitizedName}${year}-${randomCode}`;
};

// Middleware to protect routes
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing.' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed.' });
  }
};

// User Registration Route (Student, Teacher, Job Professional)
app.post('/api/register', async (req, res) => {
  const { fullName, email, password, role, countryCode, phoneNumber } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = generateUniqueUserId(role, fullName);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role,
        userId,
        countryCode,
        phoneNumber,
      },
    });

    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Registration successful!', token, user: { id: newUser.id, userId: newUser.userId, fullName: newUser.fullName, role: newUser.role } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// User Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful!', token, user: { id: user.id, userId: user.userId, fullName: user.fullName, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Course Creation (Instructor only)
app.post('/api/courses', auth, async (req, res) => {
  if (req.user.role !== 'INSTRUCTOR') {
    return res.status(403).json({ message: 'Forbidden. Instructors only.' });
  }

  const { title, description, price } = req.body;

  try {
    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        instructorId: req.user.userId,
      },
    });
    res.status(201).json({ message: 'Course submitted for review.', course: newCourse });
  } catch (error) {
    console.error('Course creation error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));