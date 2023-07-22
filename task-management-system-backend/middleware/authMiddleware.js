const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');

  try {
    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    const decoded = jwt.verify(token.replace('Bearer ', ''), 'secretKey');
    const user = await User.findById(decoded.user.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const hasPermission = (permission) => (req, res, next) => {
  if (!req.user.permissions.includes(permission)) {
    return res
      .status(403)
      .json({ message: 'You do not have permission to perform this action' });
  }
  next();
};

module.exports = { authMiddleware, hasPermission };
