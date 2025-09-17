const jwt = require('jsonwebtoken');
require('dotenv').config();

// Authenticate token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ msg: 'Invalid token' });
    req.user = user; // { User_Id, Role }
    next();
  });
}

// Role-based authorization
function authorize(allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.Role)) return res.status(403).json({ msg: 'Access Denied' });
    next();
  };
}

module.exports = { authenticateToken, authorize };
