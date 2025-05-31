import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UnauthorizedPage = () => {
  const { userRole, isAuthenticated } = useAuth();
  const location = useLocation();
  const attemptedPath = location.state?.from?.pathname || 'the requested page';

  const getHomeLink = () => {
    switch (userRole) {
      case 'admin':
        return '/admin-dashboard';
      case 'seller':
        return '/seller-home';
      case 'customer':
        return '/home';
      default:
        return '/login';
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <h1 className="display-1 text-danger mb-4">403</h1>
        <h2 className="mb-4">Unauthorized Access</h2>
        <div className="alert alert-warning mb-4">
          <p className="lead mb-2">
            You attempted to access: <strong>{attemptedPath}</strong>
          </p>
          <p className="mb-0">
            Authentication Status: <strong>{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</strong>
          </p>
          <p className="mb-0">
            Your Role: <strong>{userRole || 'None'}</strong>
          </p>
        </div>
        <div className="d-flex justify-content-center gap-3">
          <Link to={getHomeLink()} className="btn btn-primary">
            Go to Home
          </Link>
          <Link to="/" className="btn btn-outline-secondary">
            Back to Main Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage; 