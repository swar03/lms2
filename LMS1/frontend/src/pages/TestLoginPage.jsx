import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { testAuth } from '../services/api';
import bgImage from '../assets/bg1.jpg';

const TestLoginPage = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTestLogin = async (role, email, name) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting test login:', { role, email, name });
      
      // Use backend test authentication
      const response = await testAuth(email, role, name);
      console.log('Auth response:', response);
      
      const { token, user } = response;
      
      // Set auth context
      setAuth(user, token);
      console.log('Auth context set:', { user, token });
      
      // Role-based navigation
      const userRole = user.role || user.roles?.[0] || 'STUDENT';
      console.log('Navigating based on role:', userRole);
      if (userRole === 'ADMIN') {
        console.log('Navigating to admin dashboard');
        navigate('/admin-dashboard');
      } else if (userRole === 'MANAGER') {
        console.log('Navigating to manager dashboard');
        navigate('/manager-dashboard');
      } else if (userRole === 'STUDENT') {
        if (!user.profileComplete) {
          console.log('Navigating to onboarding');
          navigate('/onboarding');
        } else {
          console.log('Navigating to student dashboard');
          navigate('/dashboard');
        }
      }
    } catch (e) {
      console.error('Test login error:', e);
      setError(e?.response?.data?.message || e?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
      <div className="relative z-10 text-center p-8 bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-xl shadow-2xl max-w-md w-full mx-4">
        <h1 className="text-4xl font-extrabold text-white mb-2">CyberLMS</h1>
        <p className="text-lg text-gray-300 mb-8">Test Authentication (Google OAuth Setup Required)</p>
        
        {loading && (
          <div className="mb-6 p-4 bg-blue-900 bg-opacity-50 border border-blue-500 rounded-lg">
            <p className="text-blue-200 text-sm">Signing you in...</p>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <button
            onClick={() => handleTestLogin('STUDENT', 'student@test.com', 'Test Student')}
            disabled={loading}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            Login as Student (with Onboarding)
          </button>
          
          <button
            onClick={() => handleTestLogin('MANAGER', 'manager@lms.com', 'Test Manager')}
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            Login as Manager
          </button>
          
          <button
            onClick={() => handleTestLogin('ADMIN', 'admin@lms.com', 'Test Admin')}
            disabled={loading}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            Login as Admin
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-300 text-sm mb-2">Don't have an account?</p>
          <button
            onClick={() => navigate('/register')}
            className="text-indigo-400 hover:text-indigo-300 font-medium text-sm underline"
          >
            Register as New Student
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-gray-800 bg-opacity-50 rounded-lg text-left">
          <p className="text-xs text-gray-400 mb-2">Google OAuth Setup Required:</p>
          <div className="text-xs text-gray-300 space-y-1">
            <div>1. Go to Google Cloud Console</div>
            <div>2. Add http://localhost:5173 to authorized origins</div>
            <div>3. Replace with real Google OAuth button</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestLoginPage;