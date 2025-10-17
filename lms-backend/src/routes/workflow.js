const express = require('express');
const router = express.Router();
const { authorizeRoles } = require('../middleware/rbac');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Submit assignment or quiz
router.post('/submit', authorizeRoles(['STUDENT']), async (req, res) => {
    try {
        const { assignmentId, quizId, gdriveLink, answers } = req.body;
        const studentId = req.user.id;

        if (!assignmentId && !quizId) {
            return res.status(400).json({ message: 'Either assignmentId or quizId is required' });
        }

        const data = {
            studentId,
            submittedAt: new Date(),
        };
        
        if (assignmentId) {
            data.assignmentId = assignmentId;
            if (!gdriveLink) {
                return res.status(400).json({ message: 'gdriveLink is required for assignment submissions' });
            }
            data.gdriveLink = gdriveLink;
        }
        
        if (quizId) {
            data.quizId = quizId;
            if (!answers) {
                return res.status(400).json({ message: 'answers are required for quiz submissions' });
            }
            data.answers = answers;
            
            // Auto-grade quiz if possible
            const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
            if (quiz && quiz.questions) {
                const { score, feedback } = calculateQuizScore(quiz.questions, answers);
                data.score = score;
                data.feedback = feedback;
            }
        }

        const submission = await prisma.submission.create({ 
            data,
            include: {
                assignment: { select: { title: true, module: { select: { course: { select: { managerId: true, title: true } } } } } },
                quiz: { select: { title: true, module: { select: { course: { select: { managerId: true, title: true } } } } } },
                student: { select: { fullName: true } }
            }
        });

        // Create notification for manager
        const courseInfo = submission.assignment?.module?.course || submission.quiz?.module?.course;
        if (courseInfo) {
            const itemType = assignmentId ? 'assignment' : 'quiz';
            const itemTitle = submission.assignment?.title || submission.quiz?.title;
            
            await prisma.notification.create({
                data: {
                    userId: courseInfo.managerId,
                    type: 'SUBMISSION',
                    message: `${submission.student.fullName} submitted ${itemType}: "${itemTitle}" in course "${courseInfo.title}"`
                }
            });
        }

        res.json({ message: 'Submission received successfully', submission });
    } catch (error) {
        console.error('Submit error:', error);
        res.status(500).json({ message: 'Failed to submit' });
    }
});

// Get student's submissions
router.get('/submissions/my', authorizeRoles(['STUDENT']), async (req, res) => {
    try {
        const studentId = req.user.id;
        const submissions = await prisma.submission.findMany({
            where: { studentId },
            include: {
                assignment: {
                    select: {
                        id: true,
                        title: true,
                        module: {
                            select: {
                                title: true,
                                course: { select: { title: true } }
                            }
                        }
                    }
                },
                quiz: {
                    select: {
                        id: true,
                        title: true,
                        module: {
                            select: {
                                title: true,
                                course: { select: { title: true } }
                            }
                        }
                    }
                }
            },
            orderBy: { submittedAt: 'desc' }
        });
        
        res.json({ submissions });
    } catch (error) {
        console.error('Get my submissions error:', error);
        res.status(500).json({ message: 'Failed to fetch submissions' });
    }
});

// Manager: Get submissions for their courses
router.get('/submissions', authorizeRoles(['MANAGER', 'ADMIN']), async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId } = req.query;
        
        let whereClause = {};
        if (req.user.role === 'MANAGER') {
            if (courseId) {
                // Verify manager owns this course
                const course = await prisma.course.findFirst({
                    where: { id: courseId, managerId: userId }
                });
                if (!course) {
                    return res.status(403).json({ message: 'Not authorized to view submissions for this course' });
                }
                whereClause = {
                    OR: [
                        { assignment: { module: { courseId } } },
                        { quiz: { module: { courseId } } }
                    ]
                };
            } else {
                // Get all submissions for manager's courses
                whereClause = {
                    OR: [
                        { assignment: { module: { course: { managerId: userId } } } },
                        { quiz: { module: { course: { managerId: userId } } } }
                    ]
                };
            }
        } else if (courseId) {
            // Admin can filter by courseId
            whereClause = {
                OR: [
                    { assignment: { module: { courseId } } },
                    { quiz: { module: { courseId } } }
                ]
            };
        }
        
        const submissions = await prisma.submission.findMany({
            where: whereClause,
            include: {
                student: { select: { id: true, fullName: true, email: true } },
                assignment: {
                    select: {
                        id: true,
                        title: true,
                        module: {
                            select: {
                                title: true,
                                course: { select: { title: true } }
                            }
                        }
                    }
                },
                quiz: {
                    select: {
                        id: true,
                        title: true,
                        module: {
                            select: {
                                title: true,
                                course: { select: { title: true } }
                            }
                        }
                    }
                }
            },
            orderBy: { submittedAt: 'desc' }
        });
        
        res.json({ submissions });
    } catch (error) {
        console.error('Get submissions error:', error);
        res.status(500).json({ message: 'Failed to fetch submissions' });
    }
});

// Helper function to calculate quiz score
function calculateQuizScore(questions, answers) {
    if (!Array.isArray(questions) || !answers) {
        return { score: 0, feedback: 'Invalid quiz data' };
    }
    
    let correct = 0;
    const total = questions.length;
    const feedback = [];
    
    questions.forEach((question, index) => {
        const userAnswer = answers[index];
        const correctAnswer = question.correct || question.correctAnswer;
        
        if (userAnswer === correctAnswer) {
            correct++;
            feedback.push(`Question ${index + 1}: Correct`);
        } else {
            feedback.push(`Question ${index + 1}: Incorrect (Correct answer: ${correctAnswer})`);
        }
    });
    
    const score = (correct / total) * 100;
    return {
        score: Math.round(score * 100) / 100,
        feedback: feedback.join('; ')
    };
}

module.exports = router;
