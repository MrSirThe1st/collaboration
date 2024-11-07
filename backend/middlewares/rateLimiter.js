// import rateLimit from "express-rate-limit";

// export const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: {
//     success: false,
//     message: "Too many requests, please try again later.",
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // Specific limiter for auth routes
// export const authLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 15, // 5 attempts per hour
//   message: {
//     success: false,
//     message: "Too many login attempts, please try again later.",
//   },
// });
