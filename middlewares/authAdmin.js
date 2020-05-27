require('dotenv').config();
const bcrypt = require('bcryptjs');

module.exports = async (req, res, next) => {
  // Get token from header
  const token = req.header('auth-token');

  // Check if it exists
  if (!token)
    return res.status(401).json({ msg: 'No token present. Access denied!' });

  try {
    // Test the token to see if it is correct
    const isMatch = await bcrypt.compare(token, process.env.ADMIN_TOKEN);
    if (!isMatch) return res.status(403).json({ msg: 'Access denied!' });

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
