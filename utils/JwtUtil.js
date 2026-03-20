// CLI: npm install jsonwebtoken --save
const jwt = require('jsonwebtoken');
const MyConstants = require('./MyConstants');

const JwtUtil = {
  genToken(username, password) {
    const token = jwt.sign(
      { username: username, password: password },
      MyConstants.JWT_SECRET,
      { expiresIn: MyConstants.JWT_EXPIRES }
    );
    return token;
  },

  checkToken(req, res, next) {
    const token =
      req.headers['x-access-token'] || req.headers['authorization'];
    if (token) {
      // support 'Bearer <token>' header value
      const raw = typeof token === 'string' ? token : '';
      const parts = raw.split(' ');
      const actualToken = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : raw;

      jwt.verify(actualToken, MyConstants.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            success: false,
            message: 'Token is not valid'
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Auth token is not supplied'
      });
    }
  }
};

module.exports = JwtUtil;
