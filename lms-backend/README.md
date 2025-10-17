# LMS Backend

A comprehensive Learning Management System backend with role-based access control, enrollment workflow, and notification system.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation & Setup

1. **Clone and navigate to backend directory**
   ```bash
   cd lms-backend
   ```

2. **Run setup script (recommended)**
   ```bash
   npm run setup
   ```
   This will:
   - Install dependencies
   - Create sample .env file
   - Run database migrations
   - Seed initial data
   - Start the server

3. **Manual setup (alternative)**
   ```bash
   # Install dependencies
   npm install
   
   # Copy and configure environment
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Run database migrations
   npm run migrate
   
   # Seed initial data
   npm run seed
   
   # Start server
   npm start
   ```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/lms_db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"

# Frontend URL
FRONTEND_URL="http://localhost:5173"

# Environment
NODE_ENV="development"

# Port
PORT=3000
```

## 🏗️ Architecture

### Database Schema
- **Users**: Admin, Manager, Student roles
- **Courses**: Managed by managers
- **Modules**: Course sections with lectures, assignments, quizzes
- **Enrollments**: Student course enrollments with approval workflow
- **Notifications**: In-app notification system
- **Submissions**: Assignment and quiz submissions with auto-grading
- **Progress**: User progress tracking
- **Certificates**: Course/module completion certificates

### API Structure
```
/api
├── /auth              # Authentication (login, register, Google OAuth)
├── /dashboard         # Role-based dashboards
├── /courses           # Course management
├── /enrollments       # Enrollment workflow
├── /notifications     # Notification system
├── /submit            # Assignment/quiz submissions
├── /submissions       # Submission management
├── /users             # User management
├── /modules           # Module management
├── /lectures          # Lecture management
├── /assignments       # Assignment management
└── /quizzes           # Quiz management
```

## 🔄 Enrollment Workflow

### Complete Flow
1. **Student Registration/Enrollment**
   - Student registers with course ID → Auto-creates PENDING enrollment
   - OR Student enrolls in existing course → Creates PENDING enrollment

2. **Manager Notification**
   - Manager receives notification about enrollment request
   - Notification appears in manager dashboard

3. **Manager Review**
   - Manager views pending enrollments
   - Manager can approve or deny with optional reason

4. **Student Notification**
   - Student receives notification about approval/denial
   - If approved, student gains access to course content

### API Endpoints for Enrollment

```javascript
// Student enrolls in course
POST /api/enrollments
{
  "courseId": "course-uuid"
}

// Manager gets pending enrollments
GET /api/enrollments/pending

// Manager approves enrollment
POST /api/enrollments/:id/approve

// Manager denies enrollment
POST /api/enrollments/:id/deny
{
  "reason": "Optional denial reason"
}

// Student checks enrollment status
GET /api/enrollments/my
```

## 📱 Notification System

### Notification Types
- `ENROLLMENT_REQUEST` - Student requests enrollment
- `ENROLLMENT_APPROVED` - Manager approves enrollment
- `ENROLLMENT_DENIED` - Manager denies enrollment
- `SUBMISSION` - Student submits assignment/quiz
- `REGISTRATION` - New student registers

### Notification API
```javascript
// Get notifications (with filtering)
GET /api/notifications?unreadOnly=true&limit=50

// Mark notification as read
POST /api/notifications/:id/read

// Mark all notifications as read
POST /api/notifications/read-all

// Delete notification
DELETE /api/notifications/:id
```

## 🎯 Role-Based Access Control

### Roles & Permissions

**ADMIN**
- Full access to all endpoints
- Manage all users, courses, enrollments
- View all submissions and notifications

**MANAGER**
- Manage their assigned courses
- Approve/deny enrollments for their courses
- View submissions for their courses
- Receive notifications about their courses

**STUDENT**
- Enroll in courses
- Submit assignments and quizzes
- View their progress and certificates
- Receive notifications about their enrollments

### Protected Routes
All API routes (except public ones) require JWT authentication:
```javascript
Authorization: Bearer <jwt-token>
```

## 🧪 Testing

### Test Enrollment Workflow
```bash
npm run test-enrollment
```

This script tests the complete enrollment notification workflow:
1. Manager login
2. Student registration/enrollment
3. Notification creation
4. Manager approval
5. Student notification

### Manual Testing with Postman/curl

1. **Register Student**
   ```bash
   curl -X POST http://localhost:3000/api/register \
     -H "Content-Type: application/json" \
     -d '{
       "fullName": "John Doe",
       "email": "john@example.com",
       "password": "password123",
       "courseId": "course-uuid"
     }'
   ```

2. **Login**
   ```bash
   curl -X POST http://localhost:3000/api/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "john@example.com",
       "password": "password123"
     }'
   ```

3. **Get Notifications**
   ```bash
   curl -X GET http://localhost:3000/api/notifications \
     -H "Authorization: Bearer <token>"
   ```

## 📊 Dashboard Data

### Student Dashboard
- Enrollment status and courses
- Progress tracking
- Recent submissions
- Notifications
- Certificates

### Manager Dashboard
- Managed courses statistics
- Pending enrollments (with notifications)
- Recent submissions
- Course enrollment analytics

### Admin Dashboard
- System-wide statistics
- All users and courses
- All pending enrollments
- System notifications

## 🛠️ Development

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run setup      # Complete setup (install, migrate, seed, start)
npm run migrate    # Run database migrations
npm run seed       # Seed database with initial data
npm run studio     # Open Prisma Studio (database GUI)
npm run reset-db   # Reset database (careful!)
npm run generate   # Generate Prisma client
npm test-enrollment # Test enrollment workflow
```

### Database Management
```bash
# View database in browser
npm run studio

# Reset database (removes all data)
npm run reset-db

# Create new migration
npx prisma migrate dev --name migration-name

# Deploy migrations to production
npx prisma migrate deploy
```

## 🔧 Configuration

### CORS Configuration
The server is configured to accept requests from the frontend URL specified in `FRONTEND_URL` environment variable.

### Error Handling
- Global error handler for consistent error responses
- Validation error handling
- Database constraint error handling
- 404 handler for unknown routes

### Logging
- Request logging middleware
- Error logging
- Development endpoint listing

## 📚 API Documentation

See [API_ENDPOINTS.md](./API_ENDPOINTS.md) for complete API documentation with examples.

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use secure `JWT_SECRET`
3. Configure production database URL
4. Set appropriate `FRONTEND_URL`

### Database
1. Run migrations: `npx prisma migrate deploy`
2. Generate client: `npx prisma generate`

### Server
```bash
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is licensed under the ISC License.