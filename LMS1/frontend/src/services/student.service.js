import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class StudentService {
  // Get student profile
  async getProfile() {
    const response = await api.get('/student/profile');
    return response.data;
  }

  // Update student profile
  async updateProfile(profileData) {
    const response = await api.put('/student/profile', profileData);
    return response.data;
  }

  // Get dashboard data
  async getDashboard() {
    const response = await api.get('/student/dashboard');
    return response.data;
  }

  // Get course details
  async getCourse(courseId) {
    const response = await api.get(`/student/courses/${courseId}`);
    return response.data;
  }

  // Submit assignment
  async submitAssignment(assignmentId, assignmentLink) {
    const response = await api.post('/student/submit/assignment', {
      assignmentId,
      assignmentLink
    });
    return response.data;
  }

  // Submit quiz
  async submitQuiz(quizId, answers) {
    const response = await api.post('/student/submit/quiz', {
      quizId,
      answers
    });
    return response.data;
  }
}

export default new StudentService();