export const getCookieOptions = () => {
  const isProduction = process.env.VITE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax", 
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
    domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
  };
};
