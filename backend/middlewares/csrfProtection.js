// middlewares/csrfProtection.js - Disabled version
import crypto from "crypto";

// Generate a token but don't require it
export const generateCsrfToken = (req, res, next) => {
  // Skip CSRF token generation entirely
  next();
};

// Skip verification completely
export const verifyCsrfToken = (req, res, next) => {
  // Skip verification for all requests
  next();
};
