import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class AdminService {
  async getDashboard() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  }

  async getAllStudents() {
    const response = await api.get('/admin/students');
    return response.data;
  }

  async getPendingStudents() {
    const response = await api.get('/admin/students/pending');
    return response.data;
  }

  async approveStudent(studentId) {
    const response = await api.post(`/admin/students/${studentId}/approve`);
    return response.data;
  }

  async rejectStudent(studentId, reason) {
    const response = await api.post(`/admin/students/${studentId}/reject`, { reason });
    return response.data;
  }

  async changeStudentStatus(studentId, status, note) {
    const response = await api.post(`/admin/students/${studentId}/status`, { status, note });
    return response.data;
  }
}

export default new AdminService();