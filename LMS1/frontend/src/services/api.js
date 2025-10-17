import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch {}
    }
    return Promise.reject(error);
  }
);

// Auth functions
export async function register(fullName, email, mobile, password) {
  const { data } = await api.post('/auth/register', { fullName, email, mobile, password });
  return data;
}

export async function emailLogin(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function verifyOTP(email, otp) {
  const { data } = await api.post('/auth/verify-otp', { email, otp });
  return data;
}

export async function resendOTP(email) {
  const { data } = await api.post('/auth/resend-otp', { email });
  return data;
}

export async function getMe() {
  const { data } = await api.get('/auth/me');
  return data;
}

export async function updateProfile(profileData) {
  const { data } = await api.put('/users/profile', profileData);
  return data;
}

export async function testAuth(email, role, fullName) {
  const { data } = await api.post('/auth/test', { email, role, fullName });
  return data;
}

// User functions
export async function listUsers() {
  const { data } = await api.get('/users');
  return data;
}

// Course functions
export async function getCourses() {
  const { data } = await api.get('/courses');
  return data;
}

export async function getModules(courseId) {
  const { data } = await api.get(`/modules/${encodeURIComponent(courseId)}`);
  return data;
}

// Enrollment functions
export async function requestEnrollment(payload) {
  const { data } = await api.post('/enrollments', payload);
  return data;
}

export async function approveEnrollment(enrollmentId) {
  const { data } = await api.post(`/enrollments/${encodeURIComponent(enrollmentId)}/approve`);
  return data;
}

export async function denyEnrollment(enrollmentId) {
  const { data } = await api.post(`/enrollments/${encodeURIComponent(enrollmentId)}/deny`);
  return data;
}

// Dashboard functions
export async function getAdminDashboard() {
  const { data } = await api.get('/dashboard/admin');
  return data;
}

export async function getManagerDashboard() {
  const { data } = await api.get('/dashboard/manager');
  return data;
}

export async function getStudentDashboard() {
  const { data } = await api.get('/dashboard/student');
  return data;
}

// Notification functions
export async function getNotifications() {
  const { data } = await api.get('/notifications');
  return data;
}

export async function markNotificationAsRead(notificationId) {
  const { data } = await api.post(`/notifications/${notificationId}/read`);
  return data;
}

// Submission functions
export async function submitAssignment(assignmentId, gdriveLink) {
  const { data } = await api.post('/submit', {
    assignmentId,
    gdriveLink
  });
  return data;
}

export async function submitQuiz(quizId, answers) {
  const { data } = await api.post('/submit', {
    quizId,
    answers
  });
  return data;
}

export async function getMySubmissions() {
  const { data } = await api.get('/submissions/my');
  return data;
}

// Add googleLogin as empty function to prevent import errors
export async function googleLogin() {
  throw new Error('Google Auth not implemented');
}

// Export the axios instance as default
export default api;

// Also export as named export for compatibility
export { api };

// Export service object
export const apiService = {
  // Auth
  register,
  emailLogin,
  googleLogin,
  getMe,
  updateProfile,
  testAuth,
  
  // Users
  listUsers,
  
  // Courses
  getCourses,
  getModules,
  
  // Enrollments
  requestEnrollment,
  approveEnrollment,
  denyEnrollment,
  
  // Dashboard
  getAdminDashboard,
  getManagerDashboard,
  getStudentDashboard,
  
  // Notifications
  getNotifications,
  markNotificationAsRead,
  
  // Submissions
  submitAssignment,
  submitQuiz,
  getMySubmissions,
};


