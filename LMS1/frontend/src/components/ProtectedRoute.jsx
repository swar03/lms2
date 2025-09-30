// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // If user is not logged in, redirect them to the login page
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;