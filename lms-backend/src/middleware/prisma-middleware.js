const { PrismaClient } = require('@prisma/client')

// Models that support soft delete
const SOFT_DELETE_MODELS = ['User', 'Course', 'Module', 'Lecture', 'Assignment', 'Quiz', 'Submission']

/**
 * Soft delete middleware - automatically filters out deleted records
 */
function applySoftDeleteMiddleware(prisma) {
  prisma.$use(async (params, next) => {
    // Apply soft delete filter to read operations
    if (['findMany', 'findUnique', 'findFirst'].includes(params.action)) {
      if (SOFT_DELETE_MODELS.includes(params.model)) {
        if (!params.args) params.args = {}
        if (!params.args.where) params.args.where = {}
        
        // Don't override if explicitly including deleted records
        if (!params.args.includeDeleted) {
          params.args.where = {
            AND: [
              params.args.where,
              { deletedAt: null }
            ]
          }
        }
        
        // Remove the includeDeleted flag before passing to Prisma
        delete params.args.includeDeleted
      }
    }
    
    return next(params)
  })
}

/**
 * Audit logging middleware - logs critical actions
 */
function applyAuditMiddleware(prisma) {
  prisma.$use(async (params, next) => {
    const result = await next(params)
    
    // Log critical write operations
    const auditActions = ['create', 'update', 'delete', 'updateMany', 'deleteMany']
    const auditModels = ['User', 'Course', 'Module', 'Approval']
    
    if (auditActions.includes(params.action) && auditModels.includes(params.model)) {
      try {
        // Extract actor from context (you'll need to set this in your routes)
        const actorId = params.args?.actorId || null
        
        await prisma.auditLog.create({
          data: {
            actorId,
            action: `${params.action.toUpperCase()}_${params.model.toUpperCase()}`,
            entityType: params.model,
            entityId: result?.id || params.args?.where?.id,
            ip: params.args?.ip || null
          }
        })
      } catch (error) {
        console.error('Audit logging failed:', error)
        // Don't fail the main operation if audit logging fails
      }
    }
    
    return result
  })
}

/**
 * Cascade soft delete utility functions
 */
async function softDeleteModule(prisma, moduleId, actorId = null) {
  const now = new Date()
  
  return await prisma.$transaction(async (tx) => {
    // Soft delete module
    await tx.module.update({
      where: { id: moduleId },
      data: { deletedAt: now }
    })
    
    // Soft delete all lectures in the module
    const lectures = await tx.lecture.findMany({
      where: { moduleId, deletedAt: null }
    })
    
    for (const lecture of lectures) {
      await tx.lecture.update({
        where: { id: lecture.id },
        data: { deletedAt: now }
      })
      
      // Soft delete assignments and quizzes
      await tx.assignment.updateMany({
        where: { lectureId: lecture.id },
        data: { deletedAt: now }
      })
      
      await tx.quiz.updateMany({
        where: { lectureId: lecture.id },
        data: { deletedAt: now }
      })
      
      // Soft delete submissions
      await tx.submission.updateMany({
        where: { lectureId: lecture.id },
        data: { deletedAt: now }
      })
    }
    
    // Create audit log
    if (actorId) {
      await tx.auditLog.create({
        data: {
          actorId,
          action: 'SOFT_DELETE_MODULE',
          entityType: 'Module',
          entityId: moduleId
        }
      })
    }
  })
}

async function softDeleteCourse(prisma, courseId, actorId = null) {
  const now = new Date()
  
  return await prisma.$transaction(async (tx) => {
    // Get all modules in the course
    const modules = await tx.module.findMany({
      where: { courseId, deletedAt: null }
    })
    
    // Soft delete each module (which cascades to lectures, etc.)
    for (const module of modules) {
      await softDeleteModule(tx, module.id, actorId)
    }
    
    // Soft delete the course
    await tx.course.update({
      where: { id: courseId },
      data: { deletedAt: now }
    })
    
    // Create audit log
    if (actorId) {
      await tx.auditLog.create({
        data: {
          actorId,
          action: 'SOFT_DELETE_COURSE',
          entityType: 'Course',
          entityId: courseId
        }
      })
    }
  })
}

module.exports = {
  applySoftDeleteMiddleware,
  applyAuditMiddleware,
  softDeleteModule,
  softDeleteCourse,
  SOFT_DELETE_MODELS
}