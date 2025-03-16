export const getCookieOptions = () => {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
    domain: ".yippieapp.com", 
  };
};
