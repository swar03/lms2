import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import bgImage from '../assets/bg1.jpg';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    const googleToken = credentialResponse.credential;
    const userProfile = jwtDecode(googleToken);
    
    login({
      id: userProfile.sub,
      name: userProfile.name,
      email: userProfile.email,
      picture: userProfile.picture,
    }, googleToken);

    navigate('/dashboard');
  };

  const handleError = () => {
    console.error('Google Login Failed');
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
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              theme="outline"
              size="large"
            />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;