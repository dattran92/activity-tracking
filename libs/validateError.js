module.exports = (res, error) => {
  res.status(400).json({
    error_code: 'validator',
    error: error
  });
};
