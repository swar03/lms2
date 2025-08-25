// servers/src/index.js
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';


// Import routes and middleware
import authRoutes from './routes/auth.js';
import adminAuthMiddleware from './middleware/adminAuth.js'; // <-- Import the new middleware
import educatorAuthMiddleware from './middleware/educatorAuth.js';
import authMiddleware from './middleware/auth.js';




const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

// --- STANDARD AUTH ROUTES ---

// Manual Registration
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
        name: fullName,
        email,
        password: hashedPassword,
        role: role || 'STUDENT', // Default to STUDENT if not provided
        countryCode,
        phoneNumber,
      },
    });
    const token = jwt.sign({ userId: newUser.id, role: newUser.role, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'Registration successful!', token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Manual Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(400).json({ message: 'Invalid credentials or user may have signed up with Google.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful!', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Google Auth Routes
app.use('/api', authRoutes);


// --- NEW ADMIN-ONLY ROUTES ---

// GET All Users (Protected by adminAuthMiddleware)
app.get('/api/users', adminAuthMiddleware, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                lastLogin: true,
            }
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Failed to fetch users:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// PATCH User Role (Protected by adminAuthMiddleware)
app.patch('/api/users/:userId/role', adminAuthMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

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
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'User not found.' });
    }
    console.error('Role update error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/api/courses', educatorAuthMiddleware, async (req, res) => {
  const { userId } = req.user;
  const { title, description, price, thumbnail, chapters } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }

  try {
    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        price: parseFloat(price) || 0,
        thumbnailUrl: thumbnail,
        courseType: 'PAID_TRAINING',
        difficultyLevel: 'BEGINNER',
        instructorId: userId,
        isPublished: true, // <-- THIS IS THE FIX
        modules: {
          create: chapters.map((chapter, chapterIndex) => ({
            title: chapter.title,
            moduleOrder: chapterIndex + 1,
            difficultyLevel: 'BEGINNER',
            lessons: {
              create: chapter.modules.flatMap(module => 
                module.lectures.map((lecture, lectureIndex) => ({
                  title: lecture.title,
                  lessonOrder: lectureIndex + 1,
                  videoUrl: lecture.url,
                  durationMinutes: lecture.duration,
                  isPreview: lecture.isPreviewFree,
                }))
              ),
            },
          })),
        },
      },
      include: {
        modules: { include: { lessons: true } },
        instructor: { select: { name: true } } // Also include instructor name
      },
    });
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Failed to create course:', error);
    res.status(500).json({ message: 'Internal server error while creating course.' });
  }
});


// servers/src/index.js

// ... (after your other routes, before app.listen)

// --- NEW PUBLIC ROUTES ---

// GET all published courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true, // Only show courses that are ready
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        instructor: { // Include instructor's name
          select: {
            name: true,
          },
        },
        modules: { // Include modules and lessons for course details
          include: {
            lessons: true,
          }
        }
      },
    });
    res.status(200).json(courses);
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


app.post('/api/courses/:courseId/enroll', authMiddleware, async (req, res) => {
  // The user object (userId, role) is attached by the authMiddleware
  const { userId } = req.user;
  const { courseId } = req.params;

  try {
    // Check if the user is already enrolled to prevent duplicates
    const existingEnrollment = await prisma.courseEnrollment.findFirst({
      where: {
        studentId: userId,
        courseId: courseId,
      },
    });

    if (existingEnrollment) {
      return res.status(409).json({ message: 'You are already enrolled in this course.' });
    }

    // Create the new enrollment record
    const newEnrollment = await prisma.courseEnrollment.create({
      data: {
        studentId: userId,
        courseId: courseId,
        status: 'ACTIVE', // from your EnrollmentStatus enum
      },
    });

    res.status(201).json({
      message: 'Successfully enrolled in the course!',
      enrollment: newEnrollment,
    });
  } catch (error) {
    console.error('Enrollment failed:', error);
    // Handle cases where the course might not exist
    if (error.code === 'P2003') { // Foreign key constraint failed
        return res.status(404).json({ message: 'Course not found.' });
    }
    res.status(500).json({ message: 'Internal server error during enrollment.' });
  }
});

// servers/src/index.js

// ... (after your other routes, before app.listen)

// --- NEW STUDENT-SPECIFIC ROUTE ---

// GET /api/my-courses (Protected by authMiddleware)
app.get('/api/my-courses', authMiddleware, async (req, res) => {
  const { userId } = req.user;

  try {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: {
        studentId: userId,
      },
      include: {
        course: { // Include the full course details for each enrollment
          include: {
            instructor: {
              select: { name: true }
            }
          }
        }
      }
    });

    // We map the result to return an array of courses, not enrollments
    const courses = enrollments.map(enrollment => ({
        ...enrollment.course,
        progress: enrollment.progressPercentage // Add progress to the course object
    }));

    res.status(200).json(courses);
  } catch (error) {
    console.error("Failed to fetch student's courses:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


// ... the rest of your file (app.listen, etc.)
// ... the rest of your file (app.listen, etc.)

// ... the rest of your file (app.listen, etc.)


// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));