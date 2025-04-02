import express from "express";
import cors from "cors";

export const setupCors = (app) => {
  // Permissive CORS setup
  app.use(
    cors({
      origin: true, // Allow all origins
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
    })
  );

  // Enable preflight for all routes
  app.options("*", cors());

  // Keep Access-Control-Allow-Credentials header
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-XSRF-TOKEN"
    );
    next();
  });
};
