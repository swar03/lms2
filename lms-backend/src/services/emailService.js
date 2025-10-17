const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Verify Your Email - CyberLMS',
    html: `
      <h2>Welcome to CyberLMS!</h2>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>Or copy this link: ${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
    `
  });
}

async function sendOTPEmail(email, otp) {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Your Verification OTP - CyberLMS',
    html: `
      <h2>Email Verification</h2>
      <p>Your verification OTP is:</p>
      <h1 style="color: #4F46E5; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
      <p>This OTP will expire in 10 minutes.</p>
    `
  });
}

module.exports = { sendVerificationEmail, sendOTPEmail };