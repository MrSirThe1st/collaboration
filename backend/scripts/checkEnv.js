// scripts/checkEnv.js
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
    console.warn(`Warning: ${envFile} not found, using environment variables`);
  }
};

// Validate required environment variables
const validateEnv = () => {
  const requiredVars = [
    "DATABASE_URL",
    "SECRET_KEY",
    "CLIENT_URL",
    "PORT",
    "CLOUD_NAME",
    "API_KEY",
    "API_SECRET",
    "EMAIL_USERNAME",
    "EMAIL_PASSWORD",
  ];

  let missingVars = [];

  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error(
      "\x1b[31m%s\x1b[0m",
      "🛑 ERROR: Missing required environment variables:"
    );
    missingVars.forEach((varName) => {
      console.error(`  - ${varName}`);
    });
    console.error(
      "\nPlease set these variables in your environment or .env file"
    );
    process.exit(1);
  }

  // Additional validation for specific variables
  if (process.env.NODE_ENV === "production") {
    // Check valid MongoDB connection string
    const mongoRegex = /^mongodb(\+srv)?:\/\/.+/;
    if (!mongoRegex.test(process.env.DATABASE_URL)) {
      console.error(
        "\x1b[31m%s\x1b[0m",
        "🛑 ERROR: Invalid MongoDB connection string"
      );
      process.exit(1);
    }

    // Check SECRET_KEY strength
    if (process.env.SECRET_KEY && process.env.SECRET_KEY.length < 32) {
      console.warn(
        "\x1b[33m%s\x1b[0m",
        "⚠️ WARNING: SECRET_KEY seems weak. Consider using a stronger key in production."
      );
    }
  }

  console.log("\x1b[32m%s\x1b[0m", "✅ Environment validation passed!");
};

// Run the checks
loadEnv();
validateEnv();

// Exit successfully
process.exit(0);
