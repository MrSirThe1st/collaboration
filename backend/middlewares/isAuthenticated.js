import jwt from "jsonwebtoken";
import { AppError, asyncHandler } from "./errorHandler.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
  console.log(
    `Authentication requested for route: ${req.method} ${req.originalUrl}`
  );
  console.log(`Headers:`, req.headers);
  console.log(`Cookies:`, req.cookies);

  if (
    process.env.VITE_ENV === "development" ||
    process.env.BYPASS_AUTH === "true"
  ) {
    console.log("Bypassing authentication for development");
    req.id = "tempUserId"; // Set a temporary user ID
    return next();
  }

  const token =
    req.cookies.token ||
    (req.headers.authorization && req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    console.log("No token found in request");
    throw new AppError("Authentication required", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Decoded token:", decoded);

    if (!decoded || !decoded.userId) {
      console.log("Invalid token: missing userId");
      throw new AppError("Invalid token", 401);
    }

    req.id = decoded.userId;
    console.log(`Authenticated user ID: ${req.id}`);

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      console.log("Token expired");
      throw new AppError("Token expired", 401);
    }

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    if (error.name === "JsonWebTokenError") {
      throw new AppError("Invalid token", 401);
    } else if (error.name === "TokenExpiredError") {
      throw new AppError("Token expired", 401);
    } else if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Authentication failed", 401);
    }
  }
});

export default isAuthenticated;
