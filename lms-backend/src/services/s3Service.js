const AWS = require('aws-sdk')

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})

const s3 = new AWS.S3()

/**
 * Upload certificate to S3
 */
async function uploadCertificate(buffer, fileName) {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `certificates/${fileName}`,
      Body: buffer,
      ContentType: 'application/pdf',
      ACL: 'private'
    }

    const result = await s3.upload(params).promise()
    return {
      success: true,
      url: result.Location,
      key: result.Key
    }
  } catch (error) {
    console.error('S3 upload error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Generate presigned URL for certificate download
 */
async function getPresignedUrl(key, expiresIn = 3600) {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Expires: expiresIn
    }

    const url = await s3.getSignedUrlPromise('getObject', params)
    return {
      success: true,
      url
    }
  } catch (error) {
    console.error('Presigned URL error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

module.exports = {
  uploadCertificate,
  getPresignedUrl
}