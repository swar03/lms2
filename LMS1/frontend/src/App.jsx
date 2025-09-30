import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Core Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './components/NotFound';

// Pages
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CoursePage from './pages/CoursePage';

function App() {
  return (
    <ErrorBoundary>
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          className: '',
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes inside the Layout */}
        <Route 
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <StudentDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/manager-dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <ManagerDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/course/:courseId"
          element={
            <ProtectedRoute>
              <Layout>
                <CoursePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;