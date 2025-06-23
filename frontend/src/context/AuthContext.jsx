import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/checkRole', {
        withCredentials: true
      });
      if (response.data.success) {
        setUserRole(response.data.role);
        setIsAuthenticated(true);
      } else {
        setUserRole(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUserRole(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (role) => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await axios.get('http://localhost:5000/logout', {
        withCredentials: true
      });
      setUserRole(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      userRole, 
      isAuthenticated, 
      login, 
      logout, 
      checkAuthStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 