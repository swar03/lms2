import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

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

export async function googleLogin(googleIdToken) {
  const { data } = await api.post('/auth/google', { token: googleIdToken });
  return data;
}

export async function listUsers() {
  const { data } = await api.get('/users');
  return data;
}

export async function getCourses() {
  const { data } = await api.get('/courses');
  return data;
}

export async function getModules(courseId) {
  const { data } = await api.get(`/modules/${encodeURIComponent(courseId)}`);
  return data;
}

export async function requestEnrollment(payload) {
  const { data } = await api.post('/enroll', payload);
  return data;
}

export async function approveEnrollment(enrollmentId) {
  const { data } = await api.post(`/enroll/${encodeURIComponent(enrollmentId)}/approve`);
  return data;
}

export async function denyEnrollment(enrollmentId) {
  const { data } = await api.post(`/enroll/${encodeURIComponent(enrollmentId)}/deny`);
  return data;
}

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

export async function getMe() {
  const { data } = await api.get('/auth/me');
  return data;
}

export default api;

