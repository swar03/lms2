const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google login (keep existing)
router.post('/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'idToken required' });

    const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload.email) return res.status(400).json({ message: 'No email in Google token' });

    const user = await prisma.user.upsert({
      where: { email: payload.email },
      update: { fullName: payload.name || payload.email },
      create: { email: payload.email, fullName: payload.name || payload.email, role: 'STUDENT' }
    });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch {
    res.status(401).json({ message: 'Invalid Google token' });
  }
});

// Password registration (STUDENT) + auto-enroll PENDING to course
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, courseId } = req.body;
    if (!fullName || !email || !password || !courseId) {
      return res.status(400).json({ message: 'fullName, email, password, courseId are required' });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { fullName, email, password: hash, role: 'STUDENT' }
    });

    const course = await prisma.course.findUnique({ where: { id: courseId }, select: { id: true, managerId: true, title: true } });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const enrollment = await prisma.enrollment.upsert({
      where: { studentId_courseId: { studentId: user.id, courseId: course.id } },
      update: { status: 'PENDING' },
      create: { studentId: user.id, courseId: course.id, status: 'PENDING' }
    });

    // Notifications (dashboard only)
    await prisma.notification.create({
      data: {
        userId: course.managerId,
        type: 'REGISTRATION',
        message: `New student registered: ${fullName} (${email}) for ${course.title}`
      }
    });

    res.status(201).json({ user: { id: user.id, email: user.email }, enrollment });
  } catch (e) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

module.exports = router;
// src/routes/auth.js
router.post('/login', async (req, res) => {
  try {
    console.log('LOGIN start');
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    console.log('LOGIN user?', !!user, 'email:', email);
    if (!user || !user.password) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    console.log('LOGIN bcrypt ok?', ok);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    console.log('LOGIN jwt, secret?', !!process.env.JWT_SECRET);
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (e) {
    console.error('LOGIN ERROR:', e);
    res.status(500).json({ message: 'Login failed', error: String(e && e.message || e) });
  }
});