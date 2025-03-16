export const addSecurityHeaders = (req, res, next) => {
  // Cloudinary domain definition
  const cloudinaryDomain = `https://res.cloudinary.com/${process.env.CLOUD_NAME}/`;

  // Content Security Policy - fixed version with no line breaks in the header value
 res.setHeader(
   "Content-Security-Policy",
   "default-src 'self'; " +
     "script-src 'self' https://cdnjs.cloudflare.com; " +
     "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; " +
     "img-src 'self' data: https://res.cloudinary.com; " +
     "font-src 'self' data: https://cdnjs.cloudflare.com; " +
     "connect-src 'self' https://api.yippieapp.com; " + 
     "frame-src 'none'; " +
     "object-src 'none'; " +
     "base-uri 'self'; " +
     "form-action 'self';"
 );

  // Rest of your headers remain the same
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");

  if (process.env.VITE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );

  if (req.path.startsWith("/api/")) {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
  }

  next();
};
