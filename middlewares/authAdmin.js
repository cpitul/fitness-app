require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  // Get token from header
  const token = req.header('auth-token');

  // Check if it exists
  if (!token)
    return res.status(401).json({ msg: 'No token present. Access denied!' });

  try {
    // Test the token to see if it is correct
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.user.type === 'admin') {
      next();
    } else {
      res.status(401).json({ msg: 'Token is invalid' });
    }
  } catch (err) {
    res.status(401).json({ msg: 'Token is invalid catch' });
  }
};
