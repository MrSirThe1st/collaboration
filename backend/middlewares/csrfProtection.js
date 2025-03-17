import crypto from "crypto";

// Generate CSRF token
export const generateCsrfToken = (req, res, next) => {
  // Generate a random token
  const csrfToken = crypto.randomBytes(20).toString("hex");

  // Set it in a cookie with proper cross-domain settings
  res.cookie("XSRF-TOKEN", csrfToken, {
    httpOnly: false, // Must be false so JS can read it
    secure: false, // Required for cross-origin with SameSite=None
    sameSite: "none", // Allow cross-site cookie sharing
    path: "/",
    domain: ".yippieapp.com", // Share with all subdomains
  });

  // Make it available for templates/frontend
  res.locals.csrfToken = csrfToken;
  next();
};

// Verify CSRF token
export const verifyCsrfToken = (req, res, next) => {
  // Skip for GET, HEAD, OPTIONS requests as they should be idempotent
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  // Skip CSRF check if using Bearer token authentication
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    console.log("Skipping CSRF check for token-based authentication");
    return next();
  }

  const csrfCookie = req.cookies["XSRF-TOKEN"];
  const csrfHeader = req.headers["x-xsrf-token"];

  console.log("CSRF Check:", {
    method: req.method,
    path: req.path,
    csrfCookie,
    csrfHeader,
    cookiesReceived: req.cookies,
    headersReceived: req.headers
  });

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return res.status(403).json({
      success: false,
      message: "CSRF token validation failed",
    });
  }

  next();
};
