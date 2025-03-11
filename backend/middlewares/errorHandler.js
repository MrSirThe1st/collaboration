export const errorHandler = (err, req, res, next) => {

  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  // Don't leak error details in production
  const error =
    process.env.VITE_ENV === "production"
      ? { message }
      : { message, stack: err.stack };

  // Log error details for backend monitoring
  console.error(`[ERROR] ${req.method} ${req.path}:`, {
    error: err.message,
    stack: err.stack,
    user: req.id ? `User ID: ${req.id}` : "Unauthenticated",
    body: process.env.VITE_ENV === "production" ? "[REDACTED]" : req.body,
    query: req.query,
    timestamp: new Date().toISOString(),
  });

  // Send standardized error response
  return res.status(status).json({
    success: false,
    message,
    ...(process.env.VITE_ENV !== "production" && { details: error }),
  });
};

// Custom error class with status code
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Async handler to avoid try/catch blocks
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
