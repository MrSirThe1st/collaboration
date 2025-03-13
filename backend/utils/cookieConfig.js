// In your cookieConfig.js
export const getCookieOptions = () => {
  const isProduction = process.env.VITE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax", // IMPORTANT: Use "none" for cross-domain
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
    domain: isProduction ? ".yippieapp.com" : undefined, // Use dot prefix for subdomain support
  };
};
