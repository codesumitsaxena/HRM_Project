const jwt = require('jsonwebtoken');
require('dotenv').config();

// Authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      message: 'No token provided' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT verification error:', err.message);
      return res.status(403).json({ 
        error: 'Invalid token',
        message: 'Token verification failed' 
      });
    }
    req.user = user; // { User_Id, Role, userId, employeeId, etc. }
    next();
  });
}

// Role-based authorization
function authorize(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'User not authenticated' 
      });
    }

    const userRole = req.user.Role || req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: `Role '${userRole}' is not authorized for this action` 
      });
    }
    next();
  };
}

// Check if employee can access specific employee data
function checkEmployeeAccess(req, res, next) {
  const requestedEmployeeId = req.params.id;
  const userRole = req.user.Role || req.user.role;
  const loggedInEmployeeId = req.user.employeeId || req.user.userId || req.user.User_Id;

  console.log('Access Check:', {
    requestedEmployeeId,
    userRole,
    loggedInEmployeeId
  });

  // Admin and HR can access any employee data
  if (userRole === 'admin' || userRole === 'hr') {
    return next();
  }

  // Employee can only access their own data
  if (userRole === 'employee' && requestedEmployeeId == loggedInEmployeeId) {
    return next();
  }

  return res.status(403).json({ 
    error: 'Access denied',
    message: 'You can only access your own profile data' 
  });
}

module.exports = { authenticateToken, authorize, checkEmployeeAccess };