export const addSecurityHeaders = (req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com ; style-src 'self'; img-src 'self' data: https://res.cloudinary.com; font-src 'self' data:; connect-src 'self'"
  );


  res.setHeader("X-Content-Type-Options", "nosniff");


  res.setHeader("X-Frame-Options", "DENY");


  res.setHeader("X-XSS-Protection", "1; mode=block");

  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );


  res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");


  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );


  next();
};
