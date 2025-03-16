import express from "express";
import cors from "cors";

const allowedOrigins = ["https://yippieapp.com", "https://www.yippieapp.com"];

console.log("Request origin:", origin);
console.log("Allowed origins:", allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Blocked origin:", origin); 
      callback(new Error("Not allowed by CORS"));
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

const handleCorsError = (err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    res.status(403).json({
      success: false,
      message: "Origin not allowed",
    });
  } else {
    next(err);
  }
};

export const setupCors = (app) => {
  app.use(cors(corsOptions));
  app.use(handleCorsError);

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-XSRF-TOKEN"
    );
    next();
  });
};
