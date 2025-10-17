import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import authService from '../services/auth.service';
import bgImage from '../assets/bg1.jpg';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const response = await authService.login(formData.email, formData.password);

      if (response.success) {
        toast.success(response.message || 'Login successful!');
        
        const role = response.user.role;
        const profileComplete = response.user.profile?.profileComplete;
        
        if (role === 'ADMIN') {
          navigate('/admin-dashboard');
        } else if (role === 'MANAGER') {
          navigate('/manager-dashboard');
        } else if (role === 'STUDENT' && !profileComplete) {
          navigate('/profile-form');
        } else {
          navigate('/dashboard');
        }
      }
      
    } catch (error) {
      console.error('Login error:', error);
      const errorData = error.response?.data;
      
      if (errorData?.needsVerification) {
        toast.error('Please verify your email first');
        navigate('/verify-otp', { state: { email: errorData.email || formData.email } });
      } else {
        toast.error(errorData?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Welcome back to CyberLMS
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <span className="text-gray-300">Don't have an account? </span>
            <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
              Register here
            </Link>
          </div>
          
          <div className="mt-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg text-left">
            <p className="text-xs text-gray-400 mb-2">Admin & Manager Login:</p>
            <div className="text-xs text-gray-300 space-y-1">
              <div>• admin@lms.com / password123</div>
              <div>• manager@lms.com / password123</div>
            </div>
            <p className="text-xs text-gray-400 mt-3 mb-1">Students:</p>
            <div className="text-xs text-gray-300">
              <div>Register above, verify email, then login</div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;