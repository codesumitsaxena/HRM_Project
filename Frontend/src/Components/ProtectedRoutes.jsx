import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Components/AuthContext';

const ProtectedRoute = ({ children, requiredRoles = null }) => {
  const { isAuthenticated, user, loading, hasRole } = useAuth();
  const location = useLocation();

  // Show loading spinner while authentication is being verified
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If specific roles are required, check if user has required role
  if (requiredRoles && !hasRole(requiredRoles)) {
    return (
      <div className="container mt-5 pt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-danger text-center">
              <h4>Access Denied</h4>
              <p>You don't have permission to access this page.</p>
              <p>Your role: <strong>{user.role}</strong></p>
              <p>Required roles: <strong>{Array.isArray(requiredRoles) ? requiredRoles.join(', ') : requiredRoles}</strong></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRoles="admin">
    {children}
  </ProtectedRoute>
);

export const HRRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={['admin', 'hr']}>
    {children}
  </ProtectedRoute>
);

export const ManagerRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={['admin', 'hr', 'manager']}>
    {children}
  </ProtectedRoute>
);

export const EmployeeRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={['admin', 'hr', 'manager', 'employee']}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;