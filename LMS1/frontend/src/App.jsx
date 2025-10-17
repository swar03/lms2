// LMS1/frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import TestLoginPage from './pages/TestLoginPage';
import StudentDashboard from './pages/StudentDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SimpleAdminPanel from './pages/SimpleAdminPanel';
import AdminStudentManagement from './pages/AdminStudentManagement';
import CoursePage from './pages/CoursePage';
import OnboardingPage from './pages/OnboardingPage';
import RegisterPage from './pages/RegisterPage';
import VerifyOTPPage from './pages/VerifyOTPPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import CompleteProfileForm from './pages/CompleteProfileForm';
import TestDashboard from './pages/TestDashboard';
import Layout from './components/Layout';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/complete-profile" element={<CompleteProfilePage />} />
        <Route path="/profile-form" element={<CompleteProfileForm />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/test-dashboard" element={<TestDashboard />} />

        <Route element={<ProtectedRoute roles={['STUDENT']} />}>
          <Route
            path="/dashboard"
            element={
              <Layout>
                <StudentDashboard />
              </Layout>
            }
          />
          <Route
            path="/course/:courseId"
            element={
              <Layout>
                <CoursePage />
              </Layout>
            }
          />
        </Route>

        <Route element={<ProtectedRoute roles={['MANAGER']} />}>
          <Route
            path="/manager-dashboard"
            element={
              <Layout>
                <ManagerDashboard />
              </Layout>
            }
          />
        </Route>

        <Route element={<ProtectedRoute roles={['ADMIN']} />}>
          <Route
            path="/admin-dashboard"
            element={
              <Layout>
                <AdminDashboard />
              </Layout>
            }
          />
          <Route
            path="/admin-students"
            element={
              <Layout>
                <AdminStudentManagement />
              </Layout>
            }
          />
          <Route
            path="/simple-admin"
            element={
              <Layout>
                <SimpleAdminPanel />
              </Layout>
            }
          />
        </Route>

        <Route path="/notfound" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}