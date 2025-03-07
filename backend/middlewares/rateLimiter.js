import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import Redis from "ioredis";

// Initialize Redis client
const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  // Enable TLS if in production
  tls: process.env.NODE_ENV === "production" ? {} : undefined,
});

// Global rate limiter configuration
export const globalLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    status: 429,
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// More stringent limiter for auth routes
export const authLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 attempts per hour
  message: {
    status: 429,
    success: false,
    message: "Too many login attempts, please try again later.",
  },
});

// Sensitive operations limiter (password reset, etc.)
export const sensitiveOpLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  message: {
    status: 429,
    success: false,
    message: "Too many sensitive operations attempted, please try again later.",
  },
});

// Health check function for Redis connection
export const checkRedisHealth = async () => {
  try {
    await redisClient.ping();
    return true;
  } catch (error) {
    console.error("Redis connection error:", error);
    return false;
  }
};
