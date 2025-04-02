// middlewares/cors.js - Permissive version
import cors from "cors";

export const setupCors = (app) => {
  // Apply permissive CORS settings
  app.use(
    cors({
      origin: true, // Allow requests from any origin
      credentials: true, // Allow credentials
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["*"], // Allow all headers
      exposedHeaders: ["*"], // Expose all headers
    })
  );

  // Add CORS preflight handler for all routes
  app.options("*", cors());

  // Add headers to all responses to ensure CORS works
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Expose-Headers", "*");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    next();
  });
};
