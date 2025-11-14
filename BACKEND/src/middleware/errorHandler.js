const errorHandler = (err, req, res, next) => {
  // Handle file too large
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: 'File size should be below 5MB'
    });
  }

  // Handle video file block or unsupported type
  if (err.message === 'Video files are not allowed') {
    return res.status(400).json({
      success: false,
      error: 'Video files are not allowed'
    });
  }

  if (err.message === 'Unsupported file type') {
    return res.status(415).json({
      success: false,
      error: 'Unsupported file type. Allowed: jpg, png, webp, pdf'
    });
  }

  // Default fallback
  res.status(500).json({
    success: false,
    error: 'Something went wrong',
    detail: err.message
  });
};

export default errorHandler;
