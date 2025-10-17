const PDFDocument = require('pdfkit')
const { PrismaClient } = require('@prisma/client')
const { uploadCertificate } = require('./s3Service')

const prisma = new PrismaClient()

/**
 * Generate certificate PDF
 */
function generateCertificatePDF(studentName, moduleName, completionDate) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', layout: 'landscape' })
      const chunks = []

      doc.on('data', chunk => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))

      // Certificate design
      doc.fontSize(30).text('Certificate of Completion', 100, 100, { align: 'center' })
      doc.fontSize(20).text('This is to certify that', 100, 200, { align: 'center' })
      doc.fontSize(24).text(studentName, 100, 250, { align: 'center' })
      doc.fontSize(18).text('has successfully completed', 100, 300, { align: 'center' })
      doc.fontSize(22).text(moduleName, 100, 350, { align: 'center' })
      doc.fontSize(16).text(`Completion Date: ${completionDate}`, 100, 450, { align: 'center' })
      doc.fontSize(14).text('Growth Minds Academy', 100, 500, { align: 'center' })

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Create certificate for student
 */
async function createCertificate(userId, moduleId) {
  try {
    // Get user and module details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fullName: true, email: true }
    })

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      select: { title: true }
    })

    if (!user || !module) {
      return {
        success: false,
        message: 'User or module not found'
      }
    }

    // Check if certificate already exists
    const existingCert = await prisma.certificate.findFirst({
      where: { userId, moduleId }
    })

    if (existingCert) {
      return {
        success: true,
        certificate: existingCert,
        message: 'Certificate already exists'
      }
    }

    // Generate PDF
    const completionDate = new Date().toLocaleDateString()
    const pdfBuffer = await generateCertificatePDF(
      user.fullName || user.email,
      module.title,
      completionDate
    )

    // Upload to S3
    const fileName = `${userId}-${moduleId}-${Date.now()}.pdf`
    const uploadResult = await uploadCertificate(pdfBuffer, fileName)

    if (!uploadResult.success) {
      return {
        success: false,
        message: 'Failed to upload certificate'
      }
    }

    // Save certificate record
    const certificate = await prisma.certificate.create({
      data: {
        userId,
        moduleId,
        s3Url: uploadResult.url,
        certificateNumber: `CERT-${Date.now()}`
      }
    })

    return {
      success: true,
      certificate,
      message: 'Certificate generated successfully'
    }
  } catch (error) {
    console.error('Certificate generation error:', error)
    return {
      success: false,
      message: 'Certificate generation failed'
    }
  }
}

module.exports = {
  createCertificate,
  generateCertificatePDF
}