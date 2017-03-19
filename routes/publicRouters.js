const config = require('jkonfig')();
const router = require('express').Router();
const errorHandle = require('../libs/errorHandle');
const CustomError = require('../libs/CustomError');
const validateError = require('../libs/validateError');
const { generateToken } = require('../libs/Auth');
const { userModel } = require('../models');
const prefix = config.public_prefix;

router.post(`${prefix}/register`, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return validateError(res, 'username and password is required.');
  }

  if (username.length < 6) {
    return validateError(res, 'username is invalid.');
  }

  if (password.length < 6) {
    return validateError(res, 'password is invalid.');
  }
  const regex = /^[a-zA-Z0-9]+([-_\.][a-zA-Z0-9]+)*[a-zA-Z0-9]$/;
  if (!regex.test(username)) {
    return validateError(res, 'username is invalid.');
  }

  userModel.register(username, password)
    .then(() => res.json({
      message: 'Account is registered successfully, please login to begin!'
    }))
    .catch(() => {
      error = new CustomError('invalid_username', 'This account existed, please use another or login!');
      return errorHandle(res, error)
    });
});

router.post(`${prefix}/login`, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  userModel.login(username, password)
    .then((user) => {
      if (user) {
        return res.json({
          message: 'Login successfully!',
          token: generateToken(user),
          user: user
        });
      }
      return Promise.reject(new CustomError('invalid_auth', 'Username or password is incorrect.'));
    })
    .catch((error) => {
      return errorHandle(res, error);
    })
});

module.exports = router;
