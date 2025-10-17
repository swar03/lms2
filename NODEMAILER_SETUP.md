# 📧 Nodemailer Setup Guide

## ✨ What's Included

Your LMS now uses **basic Nodemailer** for sending emails:

- ✅ **Development**: Automatic test emails via Ethereal Email (no config needed!)
- ✅ **Production**: Easy SMTP configuration
- ✅ Beautiful HTML email templates
- ✅ OTP verification emails
- ✅ Welcome emails

## 🚀 Quick Start

### Development (No Configuration Needed!)

```bash
cd lms-backend
npm start
```

**That's it!** Emails will automatically use Ethereal Email test accounts.

When a user registers:
1. OTP is generated
2. Email is "sent" to Ethereal
3. Console shows preview URL
4. Click URL to see the email
5. OTP is also logged in console

**Example Console Output:**
```
📧 Using Ethereal Email for development
📧 Test account: test.account@ethereal.email
📧 Email sent!
📧 Preview URL: https://ethereal.email/message/xxxxx
📧 OTP: 123456
```

## 🔧 Production Setup

### Option 1: Gmail SMTP (Easiest)

1. **Enable 2-Factor Authentication** on Gmail
2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other"
   - Copy the 16-character password

3. **Update `.env`**:
```env
NODE_ENV=production
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="xxxx xxxx xxxx xxxx"
```

### Option 2: Other SMTP Providers

**SendGrid:**
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
```

**Mailgun:**
```env
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_USER="postmaster@your-domain.mailgun.org"
SMTP_PASS="your-mailgun-password"
```

**AWS SES:**
```env
SMTP_HOST="email-smtp.us-east-1.amazonaws.com"
SMTP_PORT="587"
SMTP_USER="your-ses-smtp-username"
SMTP_PASS="your-ses-smtp-password"
```

**Custom SMTP:**
```env
SMTP_HOST="mail.yourdomain.com"
SMTP_PORT="587"
SMTP_USER="noreply@yourdomain.com"
SMTP_PASS="your-password"
```

## 📧 Email Templates

### OTP Verification Email
- Professional gradient header
- Large, easy-to-read OTP
- 10-minute expiry notice
- Security warning
- Responsive design

### Welcome Email
- Congratulations message
- Feature highlights
- Login button
- Support information

## 🧪 Testing Emails

### Development Testing

1. Register a new user
2. Check console for preview URL
3. Click URL to view email in browser
4. Copy OTP from console or email
5. Verify email with OTP

### Production Testing

1. Use your real email
2. Check inbox/spam folder
3. Verify OTP works
4. Test resend OTP functionality

## 🔍 Troubleshooting

### Development Issues

**Problem**: No preview URL shown
**Solution**: Check console logs, Ethereal might be slow

**Problem**: Can't access preview URL
**Solution**: URL expires after 24 hours, register new user

### Production Issues

**Problem**: Gmail "Less secure app" error
**Solution**: Use App Password, not regular password

**Problem**: Emails going to spam
**Solution**: 
- Use verified domain
- Add SPF/DKIM records
- Warm up your sending domain

**Problem**: SMTP connection timeout
**Solution**:
- Check firewall allows port 587
- Verify SMTP credentials
- Try port 465 with `secure: true`

**Problem**: Authentication failed
**Solution**:
- Double-check username/password
- For Gmail, ensure 2FA is enabled
- Regenerate app password

## 📊 Email Service Comparison

| Service | Difficulty | Free Tier | Best For |
|---------|-----------|-----------|----------|
| Ethereal | ⭐ Easy | Unlimited | Development |
| Gmail | ⭐⭐ Easy | 500/day | Small apps |
| SendGrid | ⭐⭐ Medium | 100/day | Startups |
| AWS SES | ⭐⭐⭐ Hard | 62,000/month | Enterprise |
| Mailgun | ⭐⭐ Medium | 5,000/month | Medium apps |

## 🔐 Security Best Practices

1. **Never commit SMTP credentials** to git
2. **Use environment variables** for all secrets
3. **Enable 2FA** on email accounts
4. **Use app passwords** instead of account passwords
5. **Rotate credentials** regularly
6. **Monitor email sending** for abuse
7. **Implement rate limiting** on registration

## 📝 Customization

### Change OTP Length
```javascript
// auth.production.js
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString(); // 4 digits
```

### Change Email Templates
```javascript
// nodemailer.service.js
// Edit HTML in sendOTPEmail() and sendWelcomeEmail()
```

### Add More Email Types
```javascript
// nodemailer.service.js
async function sendPasswordResetEmail(email, resetLink) {
  // Your template here
}
```

## 🚀 Going Live Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production SMTP
- [ ] Test email delivery
- [ ] Check spam folder
- [ ] Verify OTP expiry works
- [ ] Test resend OTP
- [ ] Monitor email logs
- [ ] Set up email alerts

## 💡 Pro Tips

1. **Development**: Use Ethereal - it's free and instant
2. **Testing**: Gmail is easiest for initial testing
3. **Production**: Use dedicated email service (SendGrid, AWS SES)
4. **Monitoring**: Log all email sends for debugging
5. **Fallback**: Have backup SMTP configured

## 📞 Support

**Email not working?**
1. Check console logs for errors
2. Verify .env configuration
3. Test SMTP credentials separately
4. Check firewall/network settings

**Still stuck?**
- Development: Ethereal always works, no config needed
- Production: Try Gmail first, it's the easiest

---

**Your emails are ready to go! 📧**