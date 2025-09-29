// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const verifyToken = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/auth/profile');
      // Update user data from backend
      setUser(prev => ({ ...prev, ...response.data.user }));
    } catch (error) {
      console.error('Token verification failed:', error);
      // Don't logout immediately on verification failure
      // logout();
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        Email: email,  // Match backend expectation
        Password: password,  // Match backend expectation
      });
  
      const { token, role, name, userId, employeeId, email: userEmail, success } = response.data;
      
      const userData = { 
        role, 
        name, 
        userId: userId || employeeId,
        employeeId: employeeId || userId,
        email: userEmail || email, // Use email from response or fallback
        User_Id: userId || employeeId
      };
  
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
  
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.msg || error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const signup = async (fullName, email, password) => {
    try {
      await axios.post('http://localhost:3000/api/auth/signup', {
        Full_Name: fullName,  // Match backend expectation
        Email: email,         // Match backend expectation
        Password: password,   // Match backend expectation
      });
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error.response?.data?.msg || error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear axios default header
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear state
    setUser(null);
    setIsAuthenticated(false);
  };

  // Role checking functions
  const hasRole = (roles) => {
    if (!user) return false;
    if (typeof roles === 'string') roles = [roles];
    return roles.includes(user.role);
  };

  const isAdmin = () => hasRole('admin');
  const isHR = () => hasRole(['admin', 'hr']);
  const isManager = () => hasRole(['admin', 'hr', 'manager']);
  const isEmployee = () => hasRole(['admin', 'hr', 'manager', 'employee']);

  // Get role-based dashboard route
  const getDashboardRoute = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'admin':
        return '/adminDashboard';
      case 'hr':
        return '/hr-dashboard';
      case 'manager':
        return '/manager-dashboard';
      case 'employee':
        return '/employee-dashboard';
      default:
        return '/dashboard';
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    hasRole,
    isAdmin,
    isHR,
    isManager,
    isEmployee,
    getDashboardRoute,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};