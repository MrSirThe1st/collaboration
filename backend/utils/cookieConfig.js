// backend/utils/cookieConfig.js
export const getCookieOptions = () => {
  const isProduction = process.env.VITE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
    // Use a dot-prefixed domain to include all subdomains
    domain: isProduction ? ".yippieapp.com" : undefined,
  };
};
