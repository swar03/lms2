# Frontend Integration Guide

## Backend Status: ✅ READY

Your LMS backend is now fully functional with:
- ✅ Enrollment notification workflow
- ✅ Role-based access control
- ✅ Complete API endpoints
- ✅ Database with seeded data

## Quick Integration Steps

### 1. Update Frontend API Base URL

In your frontend `src/services/api.js`, update the base URL:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

### 2. Available Test Accounts

The backend is seeded with these accounts:

**Manager Account:**
- Email: `manager@lms.com`
- Password: `password123`
- Role: MANAGER

**Student Account:**
- Email: `student@test.com`
- Password: `password123`
- Role: STUDENT

**Admin Account:**
- Email: `admin@lms.com`
- Password: `password123`
- Role: ADMIN

### 3. Key API Endpoints Working

✅ **Authentication:**
- `POST /api/login` - Login with email/password
- `POST /api/register` - Register new student
- `GET /api/auth/me` - Get current user

✅ **Enrollment Workflow:**
- `POST /api/enrollments` - Student enrolls in course
- `GET /api/enrollments/pending` - Manager views pending enrollments
- `POST /api/enrollments/:id/approve` - Manager approves enrollment
- `POST /api/enrollments/:id/deny` - Manager denies enrollment

✅ **Notifications:**
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/:id/read` - Mark as read

✅ **Dashboards:**
- `GET /api/dashboard/student` - Student dashboard data
- `GET /api/dashboard/manager` - Manager dashboard data
- `GET /api/dashboard/admin` - Admin dashboard data

✅ **Courses:**
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details

### 4. Frontend Components to Update

#### Student Dashboard
Add enrollment request functionality:
```javascript
// In StudentDashboard.jsx
const enrollInCourse = async (courseId) => {
  try {
    const response = await fetch('/api/enrollments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ courseId })
    });
    
    if (response.ok) {
      alert('Enrollment request submitted! Wait for manager approval.');
      // Refresh enrollments
    }
  } catch (error) {
    console.error('Enrollment failed:', error);
  }
};
```

#### Manager Dashboard
Add enrollment approval functionality:
```javascript
// In ManagerDashboard.jsx
const approveEnrollment = async (enrollmentId) => {
  try {
    const response = await fetch(`/api/enrollments/${enrollmentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      alert('Enrollment approved!');
      // Refresh pending enrollments
    }
  } catch (error) {
    console.error('Approval failed:', error);
  }
};

const denyEnrollment = async (enrollmentId, reason) => {
  try {
    const response = await fetch(`/api/enrollments/${enrollmentId}/deny`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reason })
    });
    
    if (response.ok) {
      alert('Enrollment denied!');
      // Refresh pending enrollments
    }
  } catch (error) {
    console.error('Denial failed:', error);
  }
};
```

#### Notifications Component
Add notification display:
```javascript
// In Notifications.jsx
const [notifications, setNotifications] = useState([]);

useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?unreadOnly=true', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };
  
  fetchNotifications();
}, []);

const markAsRead = async (notificationId) => {
  try {
    await fetch(`/api/notifications/${notificationId}/read`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    // Remove from unread notifications
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  } catch (error) {
    console.error('Failed to mark as read:', error);
  }
};
```

### 5. Test the Complete Workflow

1. **Start Backend:** `npm start` (already running)
2. **Start Frontend:** `npm run dev` (in frontend directory)
3. **Test Flow:**
   - Login as student (`student@test.com` / `password123`)
   - Enroll in a course
   - Login as manager (`manager@lms.com` / `password123`)
   - Check notifications and pending enrollments
   - Approve/deny the enrollment
   - Login back as student to see notification

### 6. Environment Variables

Make sure your frontend `.env` has:
```env
VITE_API_URL=http://localhost:3000/api
```

### 7. CORS Configuration

The backend is already configured to accept requests from `http://localhost:5173` (Vite default).

## 🎉 You're Ready!

Your backend is fully functional with:
- ✅ Complete enrollment notification workflow
- ✅ Real-time notifications between students and managers
- ✅ Role-based dashboards
- ✅ Secure authentication
- ✅ All CRUD operations

Just update your frontend API calls to use the new endpoints and you'll have a fully working LMS with enrollment notifications!