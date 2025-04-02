import cors from "cors";

export const setupCors = (app) => {
  // Apply permissive CORS settings
  app.use(
    cors({
      origin: true, // Allow all origins
      credentials: true, // Important for cookies/authentication
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
      ],
    })
  );

  // Add CORS preflight handler
  app.options("*", cors());

  // Additional CORS headers for maximum compatibility
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    next();
  });
};
