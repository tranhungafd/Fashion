const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  let token = req.headers['authorization'];
  if (token && token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }

  if (!token && req.query.token) {
    token = req.query.token;
  }

  console.log('Token received:', token); // Thêm log để debug
  console.log('Query:', req.query); // Thêm log để kiểm tra query parameter

  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;