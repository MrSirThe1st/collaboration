// middlewares/securityHeaders.js - Disabled version

export const addSecurityHeaders = (req, res, next) => {
  // No security headers will be added

  // Simply pass through all requests
  next();
};
