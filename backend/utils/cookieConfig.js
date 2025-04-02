export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    httpOnly: false, // Allow JavaScript access if needed
    secure: isProduction, // Only use secure in production
    sameSite: isProduction ? "lax" : "lax", // Use "lax" for better compatibility
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: "/",
    // Remove domain restriction to avoid cross-domain issues
    // domain: ".yippieapp.com",
  };
};