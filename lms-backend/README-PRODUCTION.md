# 🎓 LMS Production Schema & Setup Guide

## 📋 Overview

This is a production-grade Learning Management System with:
- **Multi-role authentication** (ADMIN, MANAGER, STUDENT)
- **Approval workflow** with audit trails
- **Course → Module → Lecture hierarchy**
- **Assignment & Quiz system** with auto-grading
- **PDF Certificate generation** (S3 storage)
- **Real-time notifications**
- **Soft delete** with cascade behavior
- **Audit logging** for critical actions

## 🗄️ Database Schema

### Core Models
- **User** - Multi-role users with approval workflow
- **Profile** - Extended user information
- **Admin/Manager** - Role-specific link tables
- **Approval** - Approval history and workflow
- **Course/Module/Lecture** - Content hierarchy
- **Assignment/Quiz** - Learning activities
- **Submission** - Student work with upsert behavior
- **Certificate** - PDF certificates with S3 URLs
- **Notification** - Real-time user notifications
- **AuditLog** - System action tracking
- **SystemConfig** - Global system settings

## 🚀 Setup Instructions

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
DATABASE_URL="postgresql://username:password@localhost:5432/lms_db"
JWT_SECRET="your-super-secret-jwt-key"
AWS_S3_BUCKET="your-certificates-bucket"
```

### 2. Database Setup
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init_production_schema

# Seed database with test data
node prisma/seed-production.js
```

### 3. Start Development Server
```bash
npm run dev
# or
npm start
```

## 🔧 Key Features

### Soft Delete System
- All models support soft delete via `deletedAt` field
- Cascade soft delete for Module → Lectures → Assignments/Quizzes
- Middleware automatically filters deleted records

### Upsert Submissions
- Assignment submissions: One per user per assignment
- Quiz attempts: Overwrite previous attempts
- Automatic scoring for quizzes

### Approval Workflow
- Students register with PENDING status
- Managers/Admins approve via dashboard
- Full audit trail of all approvals

### Role-Based Access
- **ADMIN**: Full system access, user management
- **MANAGER**: Course management, user approvals
- **STUDENT**: Course access, submissions

## 📊 Test Data

After seeding, you'll have:
- **1 Admin**: admin@lms.com / password123
- **3 Managers**: manager1@lms.com, manager2@lms.com, manager3@lms.com
- **10 Students**: Various approval statuses
- **1 Course**: "Growth Minds - Core Course"
- **6 Modules**: Each with 3 lectures
- **18 Assignments & Quizzes**: One per lecture

## 🔍 Database Management

### Prisma Studio
```bash
npx prisma studio
# Opens at http://localhost:5555
```

### Soft Delete Examples
```javascript
// Soft delete a module (cascades to lectures, assignments, quizzes)
const { softDeleteModule } = require('./src/middleware/prisma-middleware')
await softDeleteModule(prisma, moduleId, actorId)

// Query with deleted records
const allUsers = await prisma.user.findMany({
  includeDeleted: true  // Custom flag to include soft-deleted
})
```

### Upsert Submissions
```javascript
const { submitAssignment, submitQuiz } = require('./src/services/submissionService')

// Submit assignment (overwrites previous)
await submitAssignment(userId, assignmentId, 'https://drive.google.com/...')

// Submit quiz (overwrites previous)
await submitQuiz(userId, quizId, answersArray, calculatedScore)
```

## 🛡️ Security Features

- **Password hashing** with bcrypt
- **JWT authentication** with refresh tokens
- **Role-based middleware** protection
- **Rate limiting** (configurable)
- **Audit logging** for sensitive operations
- **Input validation** on all endpoints

## 📈 Performance Optimizations

- **Database indexes** on frequently queried fields
- **Pagination** with configurable limits
- **Soft delete middleware** for automatic filtering
- **Connection pooling** via Prisma
- **Optimized queries** with selective includes

## 🔄 Migration Strategy

### Adding New Fields
```bash
# 1. Update schema.prisma
# 2. Create migration
npx prisma migrate dev --name add_new_field

# 3. Update seed script if needed
# 4. Regenerate client
npx prisma generate
```

### Production Deployment
```bash
# 1. Run migrations
npx prisma migrate deploy

# 2. Generate client
npx prisma generate

# 3. Start application
npm start
```

## 📝 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user

### User Management
- `GET /api/v1/users` - List users (paginated)
- `PATCH /api/v1/users/:id/approve` - Approve user
- `PATCH /api/v1/users/:id/reject` - Reject user

### Course Management
- `GET /api/v1/courses` - List courses
- `POST /api/v1/courses` - Create course (admin)
- `GET /api/v1/courses/:id` - Get course details

### Submissions
- `POST /api/v1/assignments/:id/submit` - Submit assignment
- `POST /api/v1/quizzes/:id/submit` - Submit quiz
- `GET /api/v1/submissions/my` - Get user submissions

### Certificates
- `POST /api/v1/certificates/generate` - Generate certificate
- `GET /api/v1/certificates/my` - Get user certificates

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### Test Database Reset
```bash
npx prisma migrate reset
node prisma/seed-production.js
```

## 📦 Dependencies

### Core
- `@prisma/client` - Database ORM
- `express` - Web framework
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication

### AWS Integration
- `aws-sdk` - S3 certificate storage
- `@aws-sdk/client-ses` - Email notifications

### Development
- `prisma` - Database toolkit
- `nodemon` - Development server
- `jest` - Testing framework

## 🚨 Important Notes

1. **Environment Variables**: Never commit `.env` files
2. **Database Backups**: Regular backups for production
3. **Soft Deletes**: Use application-level cascade deletes
4. **Audit Logs**: Monitor for security events
5. **Rate Limiting**: Configure based on usage patterns
6. **Certificate Storage**: Ensure S3 bucket permissions
7. **Auto-Approval**: Configure cron job for auto-approval

## 📞 Support

For issues or questions:
1. Check the audit logs for system events
2. Review Prisma Studio for data integrity
3. Monitor application logs for errors
4. Verify environment configuration

---

**🎯 This schema supports a production-ready LMS with enterprise-grade features!**