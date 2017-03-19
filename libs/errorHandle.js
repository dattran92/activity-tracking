module.exports = (res, error) => {
  if (error.type === 'custom') {
    return res.status(400).json({
      code: error.code,
      message: error.message
    });
  }
  if (process.env.NODE_ENV !== 'production') {
    return res.status(500).json({
      message: 'Hệ thống xảy ra lỗi, vui lòng thử lại',
      stack: error.stack
    });
  }
  return res.status(500).json({ message: 'Hệ thống xảy ra lỗi, vui lòng thử lại' });
};
