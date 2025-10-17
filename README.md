# CyberLMS - Learning Management System

A full-stack Learning Management System for cybersecurity education with email verification, admin approval workflow, and course management.

## Features

- 🔐 Email/Password Authentication with OTP Verification
- 📧 AWS SES Email Integration
- 👥 Role-based Access (Admin, Manager, Student)
- 📚 21 Cybersecurity Course Modules
- 📊 Progress Tracking
- ✅ Admin Approval Workflow
- 🎯 Assignment & Quiz System

## Tech Stack

**Frontend:**
- React + Vite
- TailwindCSS
- React Router
- Axios

**Backend:**
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT Authentication
- AWS SES (Email)
- Nodemailer

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL
- AWS Account (for SES)

### Backend Setup

1. Navigate to backend directory:
```bash
cd lms-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`

5. Setup database:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

6. Start backend:
```bash
npm start
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd LMS1/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start frontend:
```bash
npm run dev
```

## Environment Variables

See `.env.example` files for required environment variables.

**Important:** Never commit `.env` files to version control.

## Deployment

### Vercel (Frontend)
1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Railway/Render (Backend)
1. Connect GitHub repository
2. Set environment variables
3. Deploy

## Default Accounts

- Admin: `admin@lms.com` / `password123`
- Manager: `manager@lms.com` / `password123`

## License

MIT
