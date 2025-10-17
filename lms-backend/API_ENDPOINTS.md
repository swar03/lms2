# LMS Backend API Endpoints

## Authentication Routes (`/api`)

### POST `/api/register`
Register a new student and auto-enroll in a course
```json
{
  "fullName": "John Doe",
  "email": "john@example.com", 
  "password": "password123",
  "courseId": "course-uuid"
}
```

### POST `/api/login`
Login with email and password
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### POST `/api/auth/google`
Login with Google OAuth
```json
{
  "idToken": "google-id-token"
}
```

### GET `/api/auth/me`
Get current user info (requires Bearer token)

## Dashboard Routes (`/api/dashboard`)

### GET `/api/dashboard/admin`
Admin dashboard data (ADMIN only)

### GET `/api/dashboard/manager` 
Manager dashboard with courses, enrollments, submissions (MANAGER only)

### GET `/api/dashboard/student`
Student dashboard with enrollments, progress, certificates (STUDENT only)

## Course Routes (`/api/courses`)

### GET `/api/courses`
Get all courses with modules and manager info

### GET `/api/courses/:id`
Get specific course with full details

### POST `/api/courses`
Create new course (ADMIN/MANAGER only)
```json
{
  "title": "Course Title",
  "description": "Course description",
  "managerId": "manager-uuid"
}
```

## Enrollment Routes (`/api`)

### POST `/api/enrollments`
Student enrolls in course (creates PENDING enrollment)
```json
{
  "courseId": "course-uuid"
}
```

### GET `/api/enrollments/pending`
Manager gets pending enrollments for their courses (MANAGER/ADMIN)

### GET `/api/enrollments/my`
Student gets their enrollments (STUDENT only)

### POST `/api/enrollments/:id/approve`
Manager approves enrollment (MANAGER/ADMIN)

### POST `/api/enrollments/:id/deny`
Manager denies enrollment (MANAGER/ADMIN)
```json
{
  "reason": "Optional denial reason"
}
```

## Notification Routes (`/api`)

### GET `/api/notifications`
Get notifications for current user
Query params:
- `unreadOnly=true/false` (default: false)
- `limit=50` (default: 50)

### POST `/api/notifications/:id/read`
Mark single notification as read

### POST `/api/notifications/read-all`
Mark all notifications as read

### DELETE `/api/notifications/:id`
Delete notification

## Workflow/Submission Routes (`/api`)

### POST `/api/submit`
Submit assignment or quiz (STUDENT only)

For assignments:
```json
{
  "assignmentId": "assignment-uuid",
  "gdriveLink": "https://drive.google.com/..."
}
```

For quizzes:
```json
{
  "quizId": "quiz-uuid",
  "answers": ["answer1", "answer2", "answer3"]
}
```

### GET `/api/submissions/my`
Student gets their submissions (STUDENT only)

### GET `/api/submissions`
Manager gets submissions for their courses (MANAGER/ADMIN)
Query params:
- `courseId=uuid` (optional filter)

## Other Resource Routes

### GET `/api/users`
Get all users

### GET `/api/modules`
Get all modules with lectures, assignments, quizzes

### GET `/api/lectures`
Get all lectures

### GET `/api/assignments`
Get all assignments with submissions

### GET `/api/quizzes`
Get all quizzes with submissions

## Notification Types

- `ENROLLMENT_REQUEST` - Student requests enrollment
- `ENROLLMENT_APPROVED` - Manager approves enrollment  
- `ENROLLMENT_DENIED` - Manager denies enrollment
- `SUBMISSION` - Student submits assignment/quiz
- `REGISTRATION` - New student registers

## Authentication

All protected routes require Bearer token in Authorization header:
```
Authorization: Bearer <jwt-token>
```

## Role-Based Access

- **ADMIN**: Full access to all endpoints
- **MANAGER**: Manage their courses, enrollments, submissions
- **STUDENT**: Access their enrollments, submit work, view progress

## Enrollment Workflow

1. Student registers with `/api/register` (auto-creates PENDING enrollment)
2. OR Student enrolls with `/api/enrollments` (creates PENDING enrollment)
3. Manager gets notification about enrollment request
4. Manager views pending enrollments with `/api/enrollments/pending`
5. Manager approves/denies with `/api/enrollments/:id/approve` or `/api/enrollments/:id/deny`
6. Student gets notification about approval/denial
7. If approved, student can access course content