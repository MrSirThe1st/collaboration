import crypto from "crypto";

// Generate CSRF token but don't enforce it
export const generateCsrfToken = (req, res, next) => {
  const csrfToken = crypto.randomBytes(20).toString("hex");


  res.cookie("XSRF-TOKEN", csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", 
    path: "/",
  });
  // Set the CSRF token in the response headers
  res.locals.csrfToken = csrfToken;
  next();
};

export const verifyCsrfToken = (req, res, next) => {
  return next();
};
