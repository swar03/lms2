const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

/**
 * Auto-approve users pending for more than configured days
 */
async function autoApproveUsers() {
  try {
    // Get system config
    const config = await prisma.systemConfig.findUnique({
      where: { id: 1 }
    })

    if (!config) {
      console.log('System config not found, skipping auto-approval')
      return
    }

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - config.autoApproveDays)

    // Find users pending approval for more than autoApproveDays
    const pendingUsers = await prisma.user.findMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lt: cutoffDate
        }
      }
    })

    if (pendingUsers.length === 0) {
      console.log('No users found for auto-approval')
      return
    }

    console.log(`Auto-approving ${pendingUsers.length} users...`)

    // Auto-approve users
    for (const user of pendingUsers) {
      await prisma.$transaction(async (tx) => {
        // Update user status
        await tx.user.update({
          where: { id: user.id },
          data: {
            status: 'APPROVED',
            approvalNote: 'Auto-approved after waiting period'
          }
        })

        // Update approval records
        await tx.approval.updateMany({
          where: {
            userId: user.id,
            status: 'PENDING'
          },
          data: {
            status: 'APPROVED',
            note: 'Auto-approved after waiting period'
          }
        })

        // Create notification
        await tx.notification.create({
          data: {
            recipientId: user.id,
            type: 'APPROVAL',
            message: 'Your account has been automatically approved! Welcome to the platform.'
          }
        })

        // Create audit log
        await tx.auditLog.create({
          data: {
            action: 'AUTO_APPROVE_USER',
            entityType: 'User',
            entityId: user.id
          }
        })
      })

      console.log(`Auto-approved user: ${user.email}`)
    }

    console.log(`Auto-approval completed: ${pendingUsers.length} users approved`)
  } catch (error) {
    console.error('Auto-approval error:', error)
  }
}

/**
 * Clean up expired notifications
 */
async function cleanupExpiredNotifications() {
  try {
    const result = await prisma.notification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })

    if (result.count > 0) {
      console.log(`Cleaned up ${result.count} expired notifications`)
    }
  } catch (error) {
    console.error('Notification cleanup error:', error)
  }
}

module.exports = {
  autoApproveUsers,
  cleanupExpiredNotifications
}