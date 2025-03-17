import crypto from "crypto";

// Generate CSRF token
export const generateCsrfToken = (req, res, next) => {
  // Generate a random token
  const csrfToken = crypto.randomBytes(20).toString("hex");

  // Set it in a cookie
  res.cookie("XSRF-TOKEN", csrfToken, {
    httpOnly: false, // Readable by client-side JS
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    path: "/",
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
