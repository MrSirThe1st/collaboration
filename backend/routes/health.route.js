// routes/health.route.js
import express from "express";
import mongoose from "mongoose";
import os from "os";

const router = express.Router();

// Basic health check endpoint
router.get("/health", async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    server: {
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      osUptime: os.uptime(),
      freeMemory: os.freemem(),
      totalMemory: os.totalmem(),
      loadAvg: os.loadavg(),
    },
  };

  try {
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    res.status(503).json(healthcheck);
  }
});

// Detailed health check (protected, admin only)
router.get("/health/detailed", async (req, res) => {
  // This should be protected by admin authentication middleware
  // isAdmin middleware would go here
  try {
    const mongoStatus = {
      status:
        mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      dbName: mongoose.connection.name,
      host: mongoose.connection.host,
      collections: await mongoose.connection.db.listCollections().toArray(),
    };

    const healthInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || "1.0.0",
      process: {
        pid: process.pid,
        uptime: process.uptime() + " seconds",
        memory: {
          rss: (process.memoryUsage().rss / 1024 / 1024).toFixed(2) + " MB",
          heapTotal:
            (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2) + " MB",
          heapUsed:
            (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + " MB",
        },
      },
      system: {
        platform: os.platform(),
        arch: os.arch(),
        uptime: Math.floor(os.uptime() / 3600) + " hours",
        totalMemory: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + " GB",
        freeMemory: (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + " GB",
        cpus: os.cpus().length,
        loadAvg: os.loadavg(),
      },
      database: mongoStatus,
    };

    res.status(200).json(healthInfo);
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({
      error: "Health check failed",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

export default router;
