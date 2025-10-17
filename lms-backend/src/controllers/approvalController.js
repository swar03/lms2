const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Get pending approvals
const getPendingApprovals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 50
    const skip = (page - 1) * limit

    const approvals = await prisma.approval.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            createdAt: true,
            profile: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    const total = await prisma.approval.count({
      where: { status: 'PENDING' }
    })

    res.json({
      success: true,
      data: {
        approvals,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Get pending approvals error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending approvals'
    })
  }
}

// Approve user
const approveUser = async (req, res) => {
  try {
    const { userId } = req.params
    const { note } = req.body
    const actorId = req.user.id

    // Update user status
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'APPROVED',
        approvedById: actorId,
        approvalNote: note
      }
    })

    // Update approval record
    await prisma.approval.updateMany({
      where: {
        userId,
        status: 'PENDING'
      },
      data: {
        status: 'APPROVED',
        actorId,
        note
      }
    })

    // Create notification
    await prisma.notification.create({
      data: {
        recipientId: userId,
        type: 'APPROVAL',
        message: 'Your account has been approved! You can now access the platform.'
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        actorId,
        action: 'APPROVE_USER',
        entityType: 'User',
        entityId: userId,
        ip: req.ip
      }
    })

    res.json({
      success: true,
      message: 'User approved successfully',
      data: { user }
    })
  } catch (error) {
    console.error('Approve user error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to approve user'
    })
  }
}

// Reject user
const rejectUser = async (req, res) => {
  try {
    const { userId } = req.params
    const { note } = req.body
    const actorId = req.user.id

    if (!note) {
      return res.status(400).json({
        success: false,
        message: 'Rejection note is required'
      })
    }

    // Update user status
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'REJECTED',
        approvedById: actorId,
        approvalNote: note
      }
    })

    // Update approval record
    await prisma.approval.updateMany({
      where: {
        userId,
        status: 'PENDING'
      },
      data: {
        status: 'REJECTED',
        actorId,
        note
      }
    })

    // Create notification
    await prisma.notification.create({
      data: {
        recipientId: userId,
        type: 'APPROVAL',
        message: `Your account application has been rejected. Reason: ${note}`
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        actorId,
        action: 'REJECT_USER',
        entityType: 'User',
        entityId: userId,
        ip: req.ip
      }
    })

    res.json({
      success: true,
      message: 'User rejected successfully',
      data: { user }
    })
  } catch (error) {
    console.error('Reject user error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to reject user'
    })
  }
}

module.exports = {
  getPendingApprovals,
  approveUser,
  rejectUser
}