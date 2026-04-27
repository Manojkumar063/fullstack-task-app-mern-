const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const validator = require('validator');
const logger = require('../utils/logger');

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded: ${req.ip} - ${req.path}`);
    res.status(429).json({ message: 'Too many attempts, please try again later' });
  }
});

// Upload rate limiter
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many uploads, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Request size limiter
const requestSizeLimiter = (req, res, next) => {
  const contentLength = req.headers['content-length'];
  if (contentLength && parseInt(contentLength) > 10240) { // 10KB
    return res.status(413).json({ message: 'Request too large' });
  }
  next();
};

// XSS protection
const xssProtection = (req, res, next) => {
  const checkXSS = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        if (/<script|javascript:|onerror=|onclick=/i.test(obj[key])) {
          return true;
        }
      } else if (typeof obj[key] === 'object') {
        if (checkXSS(obj[key])) return true;
      }
    }
    return false;
  };

  if (checkXSS(req.body) || checkXSS(req.query) || checkXSS(req.params)) {
    logger.warn(`XSS attempt detected: ${req.ip} - ${req.path}`);
    return res.status(400).json({ message: 'Invalid input detected' });
  }
  next();
};

// SQL/NoSQL injection protection
const injectionProtection = (req, res, next) => {
  mongoSanitize.sanitize(req.body);
  mongoSanitize.sanitize(req.query);
  mongoSanitize.sanitize(req.params);
  next();
};

// CSRF token validation (for stateful sessions)
const csrfProtection = (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const token = req.headers['x-csrf-token'];
    const sessionToken = req.session?.csrfToken;
    
    if (!token || token !== sessionToken) {
      logger.warn(`CSRF validation failed: ${req.ip}`);
      return res.status(403).json({ message: 'Invalid request' });
    }
  }
  next();
};

// IP whitelist/blacklist
const ipFilter = (req, res, next) => {
  const blacklist = process.env.IP_BLACKLIST?.split(',') || [];
  const clientIp = req.ip || req.connection.remoteAddress;
  
  if (blacklist.includes(clientIp)) {
    logger.warn(`Blocked IP attempt: ${clientIp}`);
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// Request logging for security audit
const securityLogger = (req, res, next) => {
  logger.info({
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString()
  });
  next();
};

module.exports = {
  authLimiter,
  uploadLimiter,
  requestSizeLimiter,
  xssProtection,
  injectionProtection,
  csrfProtection,
  ipFilter,
  securityLogger
};
