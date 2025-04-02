import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token =
      req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "Please authenticate to access this resource",
        success: false,
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Check if user still exists
    const user = await User.findById(decoded.userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(401).json({
        message: "The user belonging to this token no longer exists",
        success: false,
      });
    }

    // Attach user to request
    req.user = user;
    req.id = user._id;

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    let message = "Authentication failed";
    if (error.name === "JsonWebTokenError") {
      message = "Invalid token";
    } else if (error.name === "TokenExpiredError") {
      message = "Token expired. Please log in again";
    }

    return res.status(401).json({
      message,
      success: false,
    });
  }
};

export default isAuthenticated;
