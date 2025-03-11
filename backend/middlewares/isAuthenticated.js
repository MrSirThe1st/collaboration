import jwt from "jsonwebtoken";
import { AppError, asyncHandler } from "./errorHandler.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
  // Get token from cookies or authorization header
  const token =
    req.cookies.token ||
    (req.headers.authorization && req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    throw new AppError("Authentication required", 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded || !decoded.userId) {
      throw new AppError("Invalid token", 401);
    }

    // Set user ID for use in controllers
    req.id = decoded.userId;

    // Check token expiration (additional check)
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      throw new AppError("Token expired", 401);
    }

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new AppError("Invalid token", 401);
    } else if (error.name === "TokenExpiredError") {
      throw new AppError("Token expired", 401);
    } else if (error instanceof AppError) {
      throw error;
    } else {
      console.error("Authentication error:", error);
      throw new AppError("Authentication failed", 401);
    }
  }
});

export default isAuthenticated;
