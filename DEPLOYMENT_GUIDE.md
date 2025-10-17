# 🚀 Complete LMS Deployment Guide

## 🎯 Quick Start (Automated)

### Option 1: Windows Batch Script
```bash
# Double-click or run:
start-lms.bat
```

### Option 2: Node.js Deployment
```bash
node deploy-full-project.js
```

## 🔧 Manual Deployment

### 1. Start PostgreSQL
```bash
cd lms-backend
docker-compose up -d
```

### 2. Setup Backend Database
```bash
cd lms-backend
npm run setup
```

### 3. Start Backend
```bash
npm start
```

### 4. Start Frontend
```bash
cd ../LMS1/frontend
npm run dev
```

## 🧪 Verification Commands

### Check System Status
```bash
node check-system.js
```

### Verify All APIs
```bash
cd lms-backend
npm run verify
```

### Test Integration
```bash
cd lms-backend
npm run test:integration
```

## 📊 Service URLs

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:5173 | 🎨 Main App |
| Backend API | http://localhost:5000/api/v1 | 🔧 REST API |
| Health Check | http://localhost:5000/health | 💚 Status |
| Admin Panel | http://localhost:5000/admin | 🛠️ Management |
| Database | localhost:5432 | 🗄️ PostgreSQL |

## 🔑 Test Accounts

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Admin | admin@lms.com | password123 | Full System |
| Manager | manager@lms.com | password123 | User Management |
| Student | student@test.com | password123 | Learning Content |

## 📋 API Endpoints (All Working)

### Authentication
- `POST /api/v1/auth/test` - Test login (no real auth needed)
- `POST /api/v1/auth/login` - Email/password login
- `POST /api/v1/auth/register` - Student registration
- `GET /api/v1/auth/me` - Get current user

### Courses & Learning
- `GET /api/v1/courses` - List all courses
- `GET /api/v1/modules/:courseId` - Get course modules
- `GET /api/v1/lectures/:moduleId` - Get module lectures
- `GET /api/v1/assignments` - List assignments
- `GET /api/v1/quizzes` - List quizzes

### User Management
- `GET /api/v1/users` - List users
- `PUT /api/v1/users/profile` - Update profile
- `GET /api/v1/dashboard/student` - Student dashboard
- `GET /api/v1/dashboard/manager` - Manager dashboard
- `GET /api/v1/dashboard/admin` - Admin dashboard

### Submissions & Progress
- `POST /api/v1/submit` - Submit assignments/quizzes
- `GET /api/v1/submissions` - Get user submissions
- `GET /api/v1/notifications` - Get notifications

## 🗄️ Database Schema

### Core Tables
- **Users** - Authentication and profiles
- **Courses** - Course catalog
- **Modules** - Course sections
- **Lectures** - Video content
- **Assignments** - Homework tasks
- **Quizzes** - Assessment questions
- **Submissions** - Student work
- **Notifications** - System messages
- **Certificates** - Completion awards

### Sample Data Included
- 3 Users (Admin, Manager, Student)
- 1 Course (Cybersecurity Foundations)
- 2 Modules with lectures
- Sample assignments and quizzes
- Test submissions and notifications

## 🔍 Troubleshooting

### Database Issues
```bash
# Reset database
cd lms-backend
npx prisma migrate reset
npx prisma db seed
```

### Port Conflicts
- Backend: Change PORT in .env file
- Frontend: Change port in vite.config.js
- Database: Change port in docker-compose.yml

### Service Not Starting
```bash
# Check what's running on ports
netstat -ano | findstr :5000
netstat -ano | findstr :5173
netstat -ano | findstr :5432
```

### Clear Cache
```bash
# Backend
cd lms-backend
rm -rf node_modules
npm install

# Frontend  
cd LMS1/frontend
rm -rf node_modules
npm install
```

## 🎉 Success Indicators

✅ **Backend Ready**: Console shows "Server ready for frontend integration!"
✅ **Frontend Ready**: Browser opens to http://localhost:5173
✅ **Database Ready**: Health check shows "database: connected"
✅ **APIs Working**: All endpoints return valid JSON responses
✅ **Login Working**: Test accounts can authenticate

## 📞 Support Commands

```bash
# Full system check
node check-system.js

# API verification
cd lms-backend && npm run verify

# Database status
cd lms-backend && npx prisma studio

# View logs
# Check console outputs for error messages
```

Your LMS is now fully deployed with all services connected and working! 🎓