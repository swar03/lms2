const express = require('express');
const router = express.Router();
const { authorizeRoles } = require('../middleware/rbac');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/submit', authorizeRoles(['STUDENT']), async (req, res, next) => {
    try {
        const { assignmentId, quizId, gdriveLink, answers } = req.body;
        const studentId = req.user.id;

        const data = {
            studentId,
            submittedAt: new Date(),
        };
        if (assignmentId) data.assignmentId = assignmentId;
        if (quizId) data.quizId = quizId;
        if (gdriveLink) data.gdriveLink = gdriveLink;
        if (answers) data.answers = answers;

        const submission = await prisma.submission.create({ data });

        // Optionally: create notification for manager
        const manager = await prisma.course.findUnique({
            where: { id: req.body.courseId },
            select: { managerId: true }
        });
        if (manager) {
            await prisma.notification.create({
                data: {
                    userId: manager.managerId,
                    type: 'SUBMISSION',
                    message: `Student ${studentId} submitted assignment/quiz.`,
                }
            });
        }

        res.json({ message: 'Submission received', submission });
    } catch (err) {
        next(err);
    }
});
module.exports = router;
