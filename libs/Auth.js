const jwt = require('jsonwebtoken');
const KEY = 'AnhD@ngNoiD@^u170116'

module.exports.generateToken = (user) => {
  return jwt.sign(user, KEY);
};

module.exports.authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization');
    const decoded = jwt.verify(token, KEY);
    console.log(decoded);
    if (!decoded) {
      res.status(401);
      return res.json({
        code: 'unauthorized',
        message: 'Username or password is incorrect'
      });
    }
    req.user = decoded;
    next();
  } catch(err) {
    res.status(401);
    return res.json({
      code: 'unauthorized',
      message: 'Username or password is incorrect'
    });
  }
};
