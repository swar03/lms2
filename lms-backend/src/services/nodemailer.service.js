const nodemailer = require('nodemailer');

// Create a basic nodemailer transporter
// This uses a test account from Ethereal Email for development
// In production, replace with your actual SMTP credentials

let transporter = null;

async function createTransporter() {
  if (transporter) return transporter;

  // For development: Use Ethereal Email (fake SMTP service)
  // For production: Use your actual SMTP credentials
  
  if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST) {
    // Production SMTP
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Development: Create test account
    const testAccount = await nodemailer.createTestAccount();
    
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    console.log('📧 Using Ethereal Email for development');
    console.log('📧 Test account:', testAccount.user);
  }

  return transporter;
}

async function sendOTPEmail(email, otp, fullName) {
  try {
    const transport = await createTransporter();

    const info = await transport.sendMail({
      from: '"CyberLMS" <noreply@cyberlms.com>',
      to: email,
      subject: 'Verify Your Email - CyberLMS',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; }
            .otp-box { background: #f8f9fa; border: 3px dashed #667eea; padding: 30px; text-align: center; margin: 30px 0; border-radius: 10px; }
            .otp { font-size: 42px; font-weight: bold; color: #667eea; letter-spacing: 10px; margin: 10px 0; }
            .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .info { background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Welcome to CyberLMS!</h1>
            </div>
            
            <div class="content">
              <h2>Hi ${fullName},</h2>
              <p>Thank you for registering with CyberLMS. We're excited to have you on board!</p>
              
              <p>To complete your registration, please verify your email address using the OTP below:</p>
              
              <div class="otp-box">
                <p style="margin: 0; color: #666; font-size: 14px;">Your Verification Code</p>
                <div class="otp">${otp}</div>
                <p style="margin: 10px 0 0 0; color: #999; font-size: 13px;">⏰ Valid for 10 minutes</p>
              </div>
              
              <div class="info">
                <strong>📌 Important:</strong> This OTP is confidential. Do not share it with anyone.
              </div>
              
              <p>If you didn't create an account with CyberLMS, please ignore this email.</p>
              
              <p style="margin-top: 30px;">
                Best regards,<br>
                <strong>The CyberLMS Team</strong>
              </p>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} CyberLMS. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    // For development, log the preview URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Email sent!');
      console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
      console.log('📧 OTP:', otp);
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}

async function sendWelcomeEmail(email, fullName) {
  try {
    const transport = await createTransporter();

    const info = await transport.sendMail({
      from: '"CyberLMS" <noreply@cyberlms.com>',
      to: email,
      subject: 'Welcome to CyberLMS! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
            .content { padding: 40px 30px; }
            .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .features { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .feature { margin: 10px 0; padding-left: 25px; position: relative; }
            .feature:before { content: "✓"; position: absolute; left: 0; color: #667eea; font-weight: bold; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to CyberLMS!</h1>
            </div>
            
            <div class="content">
              <h2>Hi ${fullName},</h2>
              <p>Your email has been verified successfully! You're all set to start your learning journey.</p>
              
              <div class="features">
                <h3>What you can do now:</h3>
                <div class="feature">Access all available courses</div>
                <div class="feature">Track your learning progress</div>
                <div class="feature">Complete assignments and quizzes</div>
                <div class="feature">Earn certificates upon completion</div>
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/login" class="button">Login to Dashboard</a>
              </div>
              
              <p style="margin-top: 30px;">
                If you have any questions, feel free to reach out to our support team.
              </p>
              
              <p>
                Happy Learning!<br>
                <strong>The CyberLMS Team</strong>
              </p>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} CyberLMS. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Welcome email sent!');
      console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail
};