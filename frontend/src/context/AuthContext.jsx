import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(() => {
    // Initialize from localStorage if available
    return localStorage.getItem('role') || null;
  });

  // Update localStorage when role changes
  useEffect(() => {
    if (userRole) {
      localStorage.setItem('role', userRole);
    } else {
      localStorage.removeItem('role');
    }
  }, [userRole]);

  const login = (role) => {
    setUserRole(role);
  };

  const logout = () => {
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ userRole, login, logout }}>
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