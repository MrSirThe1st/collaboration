// utils/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Set timeout for operations
      serverSelectionTimeoutMS: 5000,
      // Maximum time for connection to be established
      connectTimeoutMS: 10000,
      // Maximum number of connections in the pool
      maxPoolSize: 50,
      // Minimum number of connections in the pool
      minPoolSize: 10,
    };

    // Connect with enhanced options
    const conn = await mongoose.connect(process.env.DATABASE_URL, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Add connection event listeners for better error handling
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });

    // Graceful shutdown handling
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Exit with failure in production
    if (process.env.VITE_ENV === "production") {
      process.exit(1);
    }
  }
};

export default connectDB;
