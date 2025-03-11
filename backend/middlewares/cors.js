import express from "express";
import cors from "cors";

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins =
      process.env.VITE_ENV === "production"
        ? [process.env.VITE_API_URL]
        : [
            process.env.VITE_API_URL,
            "http://localhost:5173",
            "http://localhost:3000",
          ];


    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
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
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  optionsSuccessStatus: 204,
  maxAge: 600,
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
