const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'LMS Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Fixed API v1 routes
app.post('/api/v1/auth/test', (req, res) => {
  console.log('Auth test endpoint hit:', req.body);
  const { email = 'test@example.com', role = 'STUDENT', fullName = 'Test User' } = req.body;
  
  res.json({
    success: true,
    token: 'mock-jwt-token',
    user: {
      id: '1',
      email,
      fullName,
      role,
      roles: [role],
      status: 'APPROVED'
    }
  });
});

app.get('/api/v1/notifications', (req, res) => {
  res.json({ success: true, data: [] });
});

app.get('/api/v1/courses', (req, res) => {
  res.json({ success: true, data: [] });
});

app.get('/api/v1/dashboard/:role', (req, res) => {
  res.json({ success: true, data: { stats: {}, recent: [] } });
});

app.get('/api/v1/users', (req, res) => {
  res.json({ success: true, data: [] });
});

app.get('/api/v1/submissions', (req, res) => {
  res.json({ success: true, data: [] });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: error.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Fixed LMS Backend running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Base URL: http://localhost:${PORT}/api/v1`);
});

module.exports = app;