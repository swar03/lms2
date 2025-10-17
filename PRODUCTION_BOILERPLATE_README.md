# 🚀 Production-Ready LMS Authentication Boilerplate

Complete email-password authentication system with AWS SES/Gmail verification.

## ✨ Features

- ✅ Student registration with email verification (OTP)
- ✅ Admin/Manager login (no registration)
- ✅ JWT authentication with 7-day expiry
- ✅ Password hashing with bcrypt
- ✅ Email verification via AWS SES or Gmail SMTP
- ✅ Beautiful HTML email templates
- ✅ Input validation & error handling
- ✅ PostgreSQL with Prisma ORM
- ✅ Production-ready structure

## 📦 Quick Start

### 1. Backend Setup

```bash
cd lms-backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and configure:
# - DATABASE_URL
# - JWT_SECRET
# - Email (Gmail OR AWS SES)

# Setup database
npm run setup

# Start server
npm start
```

### 2. Frontend Setup

```bash
cd LMS1/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Email Configuration

### Option 1: Gmail (Easiest)

1. Enable 2FA on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Update `.env`:

```env
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
```

### Option 2: AWS SES (Production)

1. Verify email in AWS SES Console
2. Get SMTP credentials
3. Update `.env`:

```env
AWS_SES_SMTP_USERNAME="your-username"
AWS_SES_SMTP_PASSWORD="your-password"
SES_FROM_EMAIL="verified@yourdomain.com"
AWS_REGION="us-east-1"
```

## 📁 Project Structure

```
lms-backend/
├── src/
│   ├── config/
│   │   └── email.config.js          # Email transporter setup
│   ├── services/
│   │   └── email.service.js         # Email sending logic
│   ├── middleware/
│   │   └── validate.js              # Input validation
│   ├── routes/
│   │   └── auth.production.js       # Auth endpoints
│   └── server.production.js         # Main server
├── prisma/
│   ├── schema.prisma                # Database schema
│   └── seed-admin.js                # Admin/Manager seed
└── .env                             # Configuration

LMS1/frontend/
├── src/
│   ├── services/
│   │   └── auth.service.js          # Auth API calls
│   ├── pages/
│   │   ├── RegisterPage.jsx         # Student registration
│   │   ├── VerifyOTPPage.jsx        # Email verification
│   │   └── LoginPage.jsx            # Login (all roles)
│   └── App.jsx                      # Routes
```

## 🔐 API Endpoints

### Student Registration
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "mobile": "1234567890",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Registration successful! Check email for OTP",
  "userId": "uuid",
  "email": "john@example.com"
}
```

### Verify Email
```http
POST /api/v1/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}

Response:
{
  "success": true,
  "message": "Email verified successfully!"
}
```

### Resend OTP
```http
POST /api/v1/auth/resend-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### Login (All Roles)
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@lms.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "admin@lms.com",
    "fullName": "System Admin",
    "role": "ADMIN"
  }
}
```

### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer {token}
```

## 👥 Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lms.com | password123 |
| Manager | manager@lms.com | password123 |
| Student | Register new | - |

## 🗄️ Database Schema

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String?
  fullName      String?
  mobile        String?
  roles         Role[]   @default([])
  status        UserStatus @default(PENDING)
  emailVerified Boolean  @default(false)
  emailOTP      String?
  otpExpiry     DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum Role {
  ADMIN
  MANAGER
  STUDENT
}
```

## 🔄 User Flow

### Student Registration Flow
1. Student fills registration form
2. Backend creates user with `emailVerified: false`
3. OTP sent to email (valid 10 minutes)
4. Student enters OTP
5. Backend verifies OTP and sets `emailVerified: true`
6. Student can now login

### Admin/Manager Flow
1. Admin/Manager uses pre-created account
2. Direct login (no registration)
3. Email already verified

## 🛠️ Development

```bash
# Backend
npm run dev              # Start with nodemon
npm run setup            # Setup database
npm run seed:admin       # Seed admin accounts

# Frontend
npm run dev              # Start Vite dev server
npm run build            # Build for production
```

## 🚀 Production Deployment

### Backend
```bash
# Set environment
NODE_ENV=production

# Use strong JWT secrets
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Configure AWS SES for production emails
# Deploy to your server (AWS EC2, DigitalOcean, etc.)
```

### Frontend
```bash
# Build
npm run build

# Deploy dist/ folder to:
# - Vercel
# - Netlify
# - AWS S3 + CloudFront
```

## 📧 Email Templates

Beautiful HTML templates included:
- ✅ Verification OTP email
- ✅ Welcome email after verification
- ✅ Responsive design
- ✅ Professional styling

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT tokens with expiry
- ✅ Input validation
- ✅ SQL injection protection (Prisma)
- ✅ CORS configuration
- ✅ Helmet.js security headers
- ✅ Rate limiting ready

## 🐛 Troubleshooting

### Email not sending
- Check GMAIL_USER and GMAIL_APP_PASSWORD in .env
- Verify 2FA is enabled on Gmail
- Check AWS SES email verification status

### Database connection failed
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Run: `npm run setup`

### OTP expired
- OTP valid for 10 minutes
- Click "Resend OTP" to get new one

### Login fails after verification
- Clear browser cache
- Check email is verified in database
- Verify JWT_SECRET is set

## 📝 Customization

### Change OTP expiry
```javascript
// auth.production.js
const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
```

### Change JWT expiry
```javascript
// auth.production.js
expiresIn: '30d' // 30 days
```

### Customize email templates
```javascript
// email.service.js
// Edit HTML in sendVerificationOTP() and sendWelcomeEmail()
```

## 📄 License

MIT

## 🤝 Support

For issues or questions, check the troubleshooting section or create an issue.

---

**Built with ❤️ for production use**