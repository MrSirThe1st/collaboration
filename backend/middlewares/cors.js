import express from "express";
import cors from "cors";

export const setupCors = (app) => {
  // Add proper origin handling to include www subdomain
  const corsOptions = {
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://yippieapp.com",
        "https://www.yippieapp.com",
        "http://localhost:5173",
        "http://localhost:5174",
      ];

      // Important: always test with exact match rather than indexOf
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "X-XSRF-TOKEN",
    ],
  };

  // Apply CORS with the fixed options
  app.use(cors(corsOptions));

  // Add Access-Control-Allow-Origin to vary header to help with caching
  app.use((req, res, next) => {
    res.vary("Origin");
    next();
  });
};
