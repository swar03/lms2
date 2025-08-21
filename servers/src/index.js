import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import adminAuthMiddleware from './middleware/adminAuth.js';

// Import Google Auth routes as well
import authRoutes from './routes/auth.js';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

// --- RE-ADDED MANUAL REGISTRATION ROUTE ---
app.post('/api/register', async (req, res) => {
  const { fullName, email, password, role, countryCode, phoneNumber } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: fullName, // map to 'name' field in schema
        email,
        password: hashedPassword,
        role,
        countryCode,
        phoneNumber,
      },
    });

    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'Registration successful!', token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// --- RE-ADDED MANUAL LOGIN ROUTE ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) { // Check if user or password field exists
      return res.status(400).json({ message: 'Invalid credentials or user signed up with Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful!', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.patch('/api/users/:userId/role', adminAuthMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  // Validate the new role
  if (!role || !['STUDENT', 'EDUCATOR', 'ADMIN'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified.' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: role },
    });

    res.status(200).json({
      message: `User role updated to ${role} successfully.`,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    // P2025 is Prisma's error code for "record not found"
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'User not found.' });
    }
    console.error('Role update error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// --- GOOGLE AUTH ROUTES ---
app.use('/api', authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));