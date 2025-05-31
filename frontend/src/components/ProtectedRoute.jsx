import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userRole, isAuthenticated, checkAuthStatus } = useAuth();
  const location = useLocation();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but role doesn't match, redirect to unauthorized
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // If authenticated and role matches, render the protected content
  return children;
};

export default ProtectedRoute;
