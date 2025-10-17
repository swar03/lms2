const nodemailer = require('nodemailer');

// Email configuration - supports both Gmail and AWS SES
const getEmailTransporter = () => {
  // Try Gmail first (easier for development)
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }
  
  // Fallback to AWS SES
  if (process.env.AWS_SES_SMTP_USERNAME && process.env.AWS_SES_SMTP_PASSWORD) {
    return nodemailer.createTransport({
      host: `email-smtp.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com`,
      port: 587,
      secure: false,
      auth: {
        user: process.env.AWS_SES_SMTP_USERNAME,
        pass: process.env.AWS_SES_SMTP_PASSWORD
      }
    });
  }
  
  throw new Error('Email configuration missing. Set GMAIL_USER/GMAIL_APP_PASSWORD or AWS SES credentials.');
};

module.exports = { getEmailTransporter };