# Email Setup Guide for LMS

## Current Status
✅ **Simple Auth (No Email) is Active** - Registration works without email verification

## 3 Options to Enable Email Verification

### **Option 1: Gmail SMTP (Recommended - Easiest)**

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password

3. **Update `.env` file**:
```env
GMAIL_USER="swarchaudhary42@gmail.com"
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"  # Paste your app password here
```

4. **Switch to email auth** in `minimal-server.js`:
```javascript
const authRoutes = require('./routes/auth-email'); // Change from auth-simple
```

5. **Restart server**: `npm start`

---

### **Option 2: AWS SES (Production Ready)**

1. **Verify Email in AWS SES**:
   - Go to AWS SES Console
   - Click "Verify a New Email Address"
   - Verify `swarchaudhary42@gmail.com`

2. **Get SMTP Credentials**:
   - Go to "SMTP Settings"
   - Click "Create My SMTP Credentials"
   - Download credentials

3. **Update `.env`**:
```env
SES_FROM_EMAIL="swarchaudhary42@gmail.com"
AWS_SES_SMTP_USERNAME="your-smtp-username"
AWS_SES_SMTP_PASSWORD="your-smtp-password"
AWS_REGION="us-east-1"
```

4. **Update `emailService.js`** to use SES:
```javascript
const transporter = nodemailer.createTransport({
  host: 'email-smtp.us-east-1.amazonaws.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.AWS_SES_SMTP_USERNAME,
    pass: process.env.AWS_SES_SMTP_PASSWORD
  }
});
```

---

### **Option 3: Keep Simple Auth (No Email)**

**Current Setup** - Already working!

- Students register and can login immediately
- No email verification needed
- Perfect for development/testing
- To use: Keep `auth-simple` in `minimal-server.js`

---

## How to Switch Between Options

### Use Simple Auth (Current):
```javascript
// minimal-server.js
const authRoutes = require('./routes/auth-simple');
```

### Use Email Auth:
```javascript
// minimal-server.js
const authRoutes = require('./routes/auth-email');
```

---

## Testing Registration

### With Simple Auth (Current):
```bash
POST http://localhost:5000/api/v1/auth/register
{
  "fullName": "Test Student",
  "email": "student@test.com",
  "mobile": "1234567890",
  "password": "password123"
}
```
✅ Returns token immediately, can login right away

### With Email Auth:
```bash
POST http://localhost:5000/api/v1/auth/register
# Returns: "Check your email for OTP"

POST http://localhost:5000/api/v1/auth/verify-otp
{
  "email": "student@test.com",
  "otp": "123456"
}
# Then can login
```

---

## Recommended Approach

1. **Development**: Use **Simple Auth** (current setup)
2. **Production**: Use **Gmail SMTP** (easiest) or **AWS SES** (most reliable)

---

## Current Working Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lms.com | password123 |
| Manager | manager@lms.com | password123 |
| Student | Register new account | - |

---

## Troubleshooting

### Gmail "Less secure app" error:
- Use App Password, not regular password
- Enable 2FA first

### AWS SES "Email not verified":
- Verify sender email in SES console
- Move out of sandbox mode for production

### Still getting 500 error:
- Check backend console for exact error
- Verify .env variables are loaded
- Restart server after .env changes