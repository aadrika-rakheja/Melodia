const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET || 'melodiasecretjwtkeyforcloudmusicstreaming2026!', 
    { expiresIn: '7d' }
  );
};

module.exports = generateToken;
