export const generateCsrfToken = (req, res, next) => {
  // Generate a random token
  const csrfToken = crypto.randomBytes(20).toString("hex");

  // Set it in a cookie with proper cross-domain settings
  res.cookie("XSRF-TOKEN", csrfToken, {
    httpOnly: false, // Must be false so JS can read it
    secure: true, // Required for cross-origin with SameSite=None
    sameSite: "none", // Allow cross-site cookie sharing
    path: "/",
    domain: ".yippieapp.com", // Share with all subdomains
  });

  // Make it available for templates/frontend
  res.locals.csrfToken = csrfToken;
  next();
};
