const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

/**
 * Submit or update assignment submission (upsert behavior)
 */
async function submitAssignment(userId, assignmentId, assignmentLink, lectureId = null, moduleId = null) {
  try {
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
        lectureId,
        moduleId,
        assignmentLink
      },
      include: {
        user: { select: { fullName: true, email: true } },
        assignment: { select: { title: true } }
      }
    })

    return {
      success: true,
      submission,
      message: 'Assignment submitted successfully'
    }
  } catch (error) {
    console.error('Assignment submission error:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to submit assignment'
    }
  }
}

/**
 * Submit or update quiz attempt (upsert behavior)
 */
async function submitQuiz(userId, quizId, quizAnswers, score, lectureId = null, moduleId = null) {
  try {
    const submission = await prisma.submission.upsert({
      where: {
        user_quiz_unique: {
          userId,
          quizId
        }
      },
      update: {
        quizAnswers,
        score,
        updatedAt: new Date()
      },
      create: {
        userId,
        quizId,
        lectureId,
        moduleId,
        quizAnswers,
        score
      },
      include: {
        user: { select: { fullName: true, email: true } },
        quiz: { select: { title: true } }
      }
    })

    return {
      success: true,
      submission,
      message: 'Quiz submitted successfully'
    }
  } catch (error) {
    console.error('Quiz submission error:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to submit quiz'
    }
  }
}

module.exports = {
  submitAssignment,
  submitQuiz
}