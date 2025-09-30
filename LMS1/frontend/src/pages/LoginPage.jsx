import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';
import apiService from '../services/api';
import bgImage from '../assets/bg1.jpg';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const googleToken = credentialResponse.credential;
      
      // Send Google token to backend for verification
      const response = await apiService.googleLogin(googleToken);
      
      // Decode the JWT token from backend
      const userProfile = jwtDecode(response.token);
      
      // Store the backend JWT token and user data
      login({
        id: userProfile.id,
        name: userProfile.name || 'User',
        email: userProfile.email,
        role: userProfile.role,
        picture: userProfile.picture,
      }, response.token);

      // Navigate based on user role
      if (userProfile.role === 'MANAGER') {
        navigate('/manager-dashboard');
      } else if (userProfile.role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
      
      toast.success('Login successful!');
    } catch (error) {
      console.error('Google Login Failed:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    console.error('Google Login Failed');
    toast.error('Google login failed. Please try again.');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage:  `url(${bgImage})` }}
      ></div>
      <div className="relative z-10 text-center p-8 bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-xl shadow-2xl max-w-md w-full">
        <h1 className="text-4xl font-extrabold text-white mb-2">Welcome to CyberLMS</h1>
        <p className="text-lg text-gray-300 mb-8">Your journey into cybersecurity starts here.</p>
        <div className="flex justify-center">
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="ml-2 text-white">Signing in...</span>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              theme="outline"
              size="large"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;