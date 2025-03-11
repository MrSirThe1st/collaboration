// vite.config.js
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { readFileSync } from "fs";

export default defineConfig(({ mode }) => {
  // Load env variables based on mode
  const env = loadEnv(mode, process.cwd(), "");

  // Read package.json to get the version
  let appVersion = "1.0.0";
  try {
    const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));
    appVersion = packageJson.version || "1.0.0";
  } catch (error) {
    console.warn("Could not read package.json version", error);
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Define API url based on environment
    define: {
      // Properly define environment variables
      "import.meta.env.API_BASE_URL": JSON.stringify(
        env.VITE_API_URL || "http://localhost:8000/api/v1"
      ),
      "import.meta.env.VITE_ENV": JSON.stringify(mode),
      "import.meta.env.VITE_APP_VERSION": JSON.stringify(appVersion),
    },
    // Production build options
    build: {
      outDir: "dist",
      sourcemap: mode !== "production",
      minify: mode === "production",
      // Split chunks for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            ui: ["@/components/ui"],
            redux: [
              "redux",
              "@reduxjs/toolkit",
              "react-redux",
              "redux-persist",
            ],
          },
        },
      },
      // Asset file names to include content hash for better caching
      chunkSizeWarningLimit: 1000, // Increase warning limit to 1000kb
    },
    server: {
      port: 5173,
      strictPort: false,
      open: true,
      cors: true,
      // Proxy API requests to backend during development
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:8000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
