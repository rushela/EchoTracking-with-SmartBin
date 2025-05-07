const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (err) {
    res.status(400).json('Invalid token');
  }
};

// Middleware for environmentalist role
const isEnvironmentalist = (req, res, next) => {
  if (req.role !== 'environmentalist') {
    return res.status(403).json('Permission denied');
  }
  next();
};

module.exports = { verifyToken, isEnvironmentalist };
