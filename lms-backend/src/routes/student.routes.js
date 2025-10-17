const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Get student profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
      select: {
        id: true,
        email: true,
        fullName: true,
        mobile: true,
        city: true,
        organization: true,
        linkedin: true,
        roles: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        profile: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        ...user,
        role: user.roles[0]
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

// Complete/Update student profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { city, organization, linkedin, occupation, country, whatsapp, dateOfBirth, gender, address, education, experience, skills } = req.body;

    // Update user basic info
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { city, organization, linkedin }
    });

    // Create or update profile
    const profile = await prisma.profile.upsert({
      where: { userId: req.user.id },
      update: {
        occupation,
        country,
        whatsapp,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        address,
        education,
        experience,
        skills,
        profileComplete: true
      },
      create: {
        userId: req.user.id,
        occupation,
        country,
        whatsapp,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        address,
        education,
        experience,
        skills,
        profileComplete: true
      }
    });

    // Notify all admins and managers
    const adminsAndManagers = await prisma.user.findMany({
      where: {
        OR: [
          { roles: { has: 'ADMIN' } },
          { roles: { has: 'MANAGER' } }
        ]
      }
    });

    await Promise.all(
      adminsAndManagers.map(admin =>
        prisma.notification.create({
          data: {
            recipientId: admin.id,
            type: 'NEW_USER',
            message: `${user.fullName || user.email} completed their profile and is pending approval.`
          }
        })
      )
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        mobile: user.mobile,
        city: user.city,
        organization: user.organization,
        linkedin: user.linkedin,
        role: user.roles[0]
      },
      profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

// Get student dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        roles: true
      }
    });

    // Get all courses
    const courses = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            lectures: true
          }
        }
      }
    });

    // Get user submissions
    const submissions = await prisma.submission.findMany({
      where: { userId },
      include: {
        assignment: true,
        quiz: true,
        lecture: {
          include: {
            module: {
              include: {
                course: true
              }
            }
          }
        }
      }
    });

    // Get user certificates
    const certificates = await prisma.certificate.findMany({
      where: { userId },
      include: {
        module: {
          include: {
            course: true
          }
        }
      }
    });

    // Get notifications
    const notifications = await prisma.notification.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Calculate progress
    const totalLectures = courses.reduce((sum, course) => 
      sum + course.modules.reduce((mSum, module) => mSum + module.lectures.length, 0), 0
    );
    
    const completedLectures = submissions.filter(s => s.lectureId).length;
    const progressPercentage = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

    res.json({
      success: true,
      data: {
        user: {
          ...user,
          role: user.roles[0]
        },
        stats: {
          totalCourses: courses.length,
          enrolledCourses: courses.length,
          completedLectures,
          totalLectures,
          progressPercentage,
          certificates: certificates.length,
          pendingAssignments: submissions.filter(s => s.assignmentId && !s.score).length
        },
        courses,
        recentSubmissions: submissions.slice(0, 5),
        certificates,
        notifications: notifications.map(n => ({
          ...n,
          read: n.read
        }))
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
});

// Get specific course details
router.get('/courses/:courseId', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lectures: {
              include: {
                assignment: true,
                quiz: {
                  include: {
                    questions: {
                      include: {
                        choices: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Get user's submissions for this course
    const submissions = await prisma.submission.findMany({
      where: {
        userId,
        lecture: {
          module: {
            courseId
          }
        }
      }
    });

    res.json({
      success: true,
      course,
      userSubmissions: submissions
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch course' });
  }
});

// Submit assignment
router.post('/submit/assignment', authenticateToken, async (req, res) => {
  try {
    const { assignmentId, assignmentLink } = req.body;
    const userId = req.user.id;

    if (!assignmentId || !assignmentLink) {
      return res.status(400).json({ success: false, message: 'Assignment ID and link are required' });
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { lecture: true }
    });

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const submission = await prisma.submission.upsert({
      where: {
        user_assignment_unique: {
          userId,
          assignmentId
        }
      },
      update: {
        assignmentLink,
        updatedAt: new Date()
      },
      create: {
        userId,
        assignmentId,
        lectureId: assignment.lectureId,
        assignmentLink
      }
    });

    res.json({
      success: true,
      message: 'Assignment submitted successfully',
      submission
    });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit assignment' });
  }
});

// Submit quiz
router.post('/submit/quiz', authenticateToken, async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const userId = req.user.id;

    if (!quizId || !answers) {
      return res.status(400).json({ success: false, message: 'Quiz ID and answers are required' });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        lecture: true,
        questions: {
          include: {
            choices: true
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id];
      const correctChoice = question.choices.find(c => c.isCorrect);
      if (correctChoice && userAnswer === correctChoice.id) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / quiz.questions.length) * 100;

    const submission = await prisma.submission.upsert({
      where: {
        user_quiz_unique: {
          userId,
          quizId
        }
      },
      update: {
        quizAnswers: answers,
        score,
        updatedAt: new Date()
      },
      create: {
        userId,
        quizId,
        lectureId: quiz.lectureId,
        quizAnswers: answers,
        score
      }
    });

    res.json({
      success: true,
      message: 'Quiz submitted successfully',
      submission,
      score,
      correctAnswers,
      totalQuestions: quiz.questions.length
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit quiz' });
  }
});

module.exports = router;