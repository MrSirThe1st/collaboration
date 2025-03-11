import rateLimit from "express-rate-limit";


export const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
      status: 429,
      success: false,
      message: "Too many requests, please try again later.",
    },
    skipSuccessfulRequests: false, // Count all requests
    // Skip rate limiting in development
    skip: () => process.env.VITE_ENV !== "production",
  };

  return rateLimit({
    ...defaultOptions,
    ...options,
  });
};

// More stringent limiter for auth routes
export const authLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts per hour
  message: {
    status: 429,
    success: false,
    message: "Too many login attempts, please try again later.",
  },
});

// Limited for sensitive operations (password reset, etc.)
export const sensitiveOpLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  message: {
    status: 429,
    success: false,
    message: "Too many sensitive operations attempted, please try again later.",
  },
});

// API rate limiter
export const apiLimiter = createRateLimiter();
