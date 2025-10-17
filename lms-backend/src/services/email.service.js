const { getEmailTransporter } = require('../config/email.config');

class EmailService {
  constructor() {
    try {
      this.transporter = getEmailTransporter();
      this.fromEmail = process.env.GMAIL_USER || process.env.SES_FROM_EMAIL;
    } catch (error) {
      console.warn('⚠️  Email service not configured:', error.message);
      this.transporter = null;
    }
  }

  async sendVerificationOTP(email, otp, fullName) {
    if (!this.transporter) {
      console.log('📧 Email not configured. OTP:', otp);
      return { success: false, message: 'Email service not configured' };
    }

    try {
      await this.transporter.sendMail({
        from: `"CyberLMS" <${this.fromEmail}>`,
        to: email,
        subject: 'Verify Your Email - CyberLMS',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
              .otp { font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to CyberLMS!</h1>
              </div>
              <div class="content">
                <p>Hi ${fullName},</p>
                <p>Thank you for registering with CyberLMS. Please verify your email address using the OTP below:</p>
                
                <div class="otp-box">
                  <p style="margin: 0; color: #666;">Your Verification OTP</p>
                  <div class="otp">${otp}</div>
                  <p style="margin: 10px 0 0 0; color: #999; font-size: 14px;">Valid for 10 minutes</p>
                </div>
                
                <p>If you didn't create an account, please ignore this email.</p>
                
                <div class="footer">
                  <p>© ${new Date().getFullYear()} CyberLMS. All rights reserved.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      });

      return { success: true };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, message: error.message };
    }
  }

  async sendWelcomeEmail(email, fullName) {
    if (!this.transporter) return { success: false };

    try {
      await this.transporter.sendMail({
        from: `"CyberLMS" <${this.fromEmail}>`,
        to: email,
        subject: 'Welcome to CyberLMS!',
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #667eea;">Welcome to CyberLMS, ${fullName}! 🎉</h2>
              <p>Your email has been verified successfully. You can now access all courses and features.</p>
              <p>Start your learning journey today!</p>
              <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Login to Dashboard</a>
            </div>
          </body>
          </html>
        `
      });

      return { success: true };
    } catch (error) {
      console.error('Welcome email error:', error);
      return { success: false };
    }
  }
}

module.exports = new EmailService();