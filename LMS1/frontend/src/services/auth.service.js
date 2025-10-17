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

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class AuthService {
  // Student Registration
  async register(fullName, email, mobile, password) {
    const response = await api.post('/auth/register', {
      fullName,
      email,
      mobile,
      password
    });
    return response.data;
  }

  // Verify OTP
  async verifyOTP(email, otp) {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  }

  // Resend OTP
  async resendOTP(email) {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  }

  // Login (All roles)
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  // Get current user
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Get stored user
  getStoredUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

export default new AuthService();