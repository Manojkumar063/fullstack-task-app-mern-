const redis = require('redis');
const logger = require('./logger');

let redisClient = null;

const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    logger.warn('Redis URL not configured, caching disabled');
    return null;
  }

  try {
    redisClient = redis.createClient({ url: process.env.REDIS_URL });
    
    redisClient.on('error', (err) => logger.error('Redis error:', err));
    redisClient.on('connect', () => logger.info('Redis connected'));
    
    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.error('Redis connection failed:', error);
    return null;
  }
};

const getCache = async (key) => {
  if (!redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('Cache get error:', error);
    return null;
  }
};

const setCache = async (key, value, ttl = 300) => {
  if (!redisClient) return false;
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    logger.error('Cache set error:', error);
    return false;
  }
};

const deleteCache = async (key) => {
  if (!redisClient) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error('Cache delete error:', error);
    return false;
  }
};

module.exports = { connectRedis, getCache, setCache, deleteCache };
