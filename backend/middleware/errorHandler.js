const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  
  res.status(err.statusCode || 500).json({ 
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
};

module.exports = errorHandler;
