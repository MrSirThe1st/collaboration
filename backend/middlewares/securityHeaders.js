export const addSecurityHeaders = (req, res, next) => {
  // Cloudinary domain definition
  const cloudinaryDomain = `https://res.cloudinary.com/${process.env.CLOUD_NAME}/`;

  // Content Security Policy - customize based on application's needs
  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self'; 
     script-src 'self' https://cdnjs.cloudflare.com; 
     style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; 
     img-src 'self' data: ${cloudinaryDomain} https://res.cloudinary.com; 
     font-src 'self' data: https://cdnjs.cloudflare.com; 
     connect-src 'self' ${process.env.VITE_API_URL} ${process.env.API_URL}; 
     frame-src 'none';
     object-src 'none';
     base-uri 'self';
     form-action 'self';`
  );

  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Enable XSS filter in browser
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // HSTS (HTTP Strict Transport Security) - only in production
  if (process.env.VITE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // Control browser features
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions policy
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );

  // For APIs
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
