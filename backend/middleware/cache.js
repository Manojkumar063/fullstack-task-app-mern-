const { getCache, setCache } = require('../utils/redis');

const cacheMiddleware = (ttl = 300) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') return next();

    const key = `cache:${req.user?.id || 'public'}:${req.originalUrl}`;
    
    const cached = await getCache(key);
    if (cached) {
      return res.json(cached);
    }

    const originalJson = res.json.bind(res);
    res.json = (data) => {
      setCache(key, data, ttl);
      return originalJson(data);
    };

    next();
  };
};

module.exports = cacheMiddleware;
