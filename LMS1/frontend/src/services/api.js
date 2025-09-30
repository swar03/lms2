// src/services/api.js
const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('jwt_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async googleLogin(idToken) {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken })
    });
  }

  async register(userData) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(email, password) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  // Course endpoints
  async getCourses() {
    return this.request('/courses');
  }

  async getCourseById(courseId) {
    return this.request(`/courses/${courseId}`);
  }

  // Module endpoints
  async getModules() {
    return this.request('/modules');
  }

  // Lecture endpoints
  async getLectures() {
    return this.request('/lectures');
  }

  // Assignment endpoints
  async getAssignments() {
    return this.request('/assignments');
  }

  // Quiz endpoints
  async getQuizzes() {
    return this.request('/quizzes');
  }

  // Enrollment endpoints
  async getPendingEnrollments() {
    return this.request('/enrollments/pending');
  }

  async approveEnrollment(enrollmentId) {
    return this.request(`/enrollments/${enrollmentId}/approve`, {
      method: 'POST'
    });
  }

  async denyEnrollment(enrollmentId) {
    return this.request(`/enrollments/${enrollmentId}/deny`, {
      method: 'POST'
    });
  }

  // Submission endpoints
  async submitAssignment(submissionData) {
    return this.request('/submit', {
      method: 'POST',
      body: JSON.stringify(submissionData)
    });
  }

  // Notification endpoints
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(notificationId) {
    return this.request('/notifications/read', {
      method: 'POST',
      body: JSON.stringify({ notificationId })
    });
  }

  // User endpoints
  async getUsers() {
    return this.request('/users');
  }
}

export default new ApiService();
