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
    req.user = user; // { User_Id, Role }
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

    if (!allowedRoles.includes(req.user.Role)) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: `Role '${req.user.Role}' is not authorized for this action` 
      });
    }
    next();
  };
}

module.exports = { authenticateToken, authorize };