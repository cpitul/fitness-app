require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  // Get token from header
  const token = req.header('auth-token');

  // Check if it exists
  if (!token) return res.status(401).json({ msg: 'No token present.' });

  try {
    // Test if admin request
    const isMatch = await bcrypt.compare(token, process.env.ADMIN_TOKEN);
    if (isMatch) next();

    // Decode the token to see what user made the request
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Set the user that made the request into req.user
    req.user = decoded.user;

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
