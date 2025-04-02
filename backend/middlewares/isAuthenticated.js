import jwt from "jsonwebtoken";
// import { JWT_SECRET } from "../utils/constants.js";
import { User } from "../models/user.model.js";

import.meta.env.SECRET_KEY;

const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        message: "Not authenticated - no token",
        success: false,
      });
    }

    // Verify token
    const decoded = await jwt.verify(token, SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        message: "The user belonging to this token no longer exists",
        success: false,
      });
    }

    // Add user ID to request
    req.id = decoded.userId;
    req.user = user; // Optional: Add the full user object

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
        success: false,
      });
    }

    return res.status(401).json({
      message: "Authentication failed",
      success: false,
    });
  }
};

export default isAuthenticated;
