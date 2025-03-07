// backend/utils/secure-env.js

import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables based on NODE_ENV
const loadEnv = () => {
  const envFile =
    process.env.NODE_ENV === "production" ? ".env.production" : ".env";

  const envPath = path.resolve(process.cwd(), envFile);

  if (fs.existsSync(envPath)) {
    const result = dotenv.config({ path: envPath });
    if (result.error) {
      console.error(`Error loading ${envFile}:`, result.error);
      process.exit(1);
    }
  } else {
    console.warn(`Warning: ${envFile} not found`);
  }
};

// Validate required environment variables
const validateEnv = () => {
  const required = ["DATABASE_URL", "SECRET_KEY", "CLIENT_URL"];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
    process.exit(1);
  }
};

export const initEnv = () => {
  loadEnv();
  validateEnv();

  // Mask sensitive values in logs
  const masked = Object.entries(process.env).reduce((acc, [key, value]) => {
    if (
      key.includes("KEY") ||
      key.includes("SECRET") ||
      key.includes("PASSWORD") ||
      key.includes("TOKEN")
    ) {
      acc[key] = "********";
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});

  console.log("Environment loaded:", masked);
};
