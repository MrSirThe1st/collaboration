import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import projectRoute from "./routes/project.route.js";
import groupRoute from "./routes/group.route.js";
import requestRoute from "./routes/request.route.js";
import invitationRoute from "./routes/invitation.route.js";
import channelRoute from "./routes/channel.route.js";
import taskRoute from "./routes/task.route.js"
import milestoneRoute from "./routes/milestone.route.js";
import fileRoute from "./routes/file.route.js"
import documentationRoute from "./routes/documentation.route.js"
import projectMessageRoutes from "./routes/projectMessage.route.js";
import directMessageRoutes from "./routes/directMessage.route.js";
import http from "http";
import { Server } from "socket.io";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Map to store user socket IDs
const userSocketMap = {};

// Handle new connections
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/group", groupRoute);
app.use("/api/v1/project", projectRoute);
app.use("/api/v1/request", requestRoute);
app.use("/api/v1/invitation", invitationRoute);
app.use("/api/v1/channel", channelRoute);
app.use("/api/v1/task", taskRoute);
app.use("/api/v1/milestone", milestoneRoute);
app.use("/api/v1/files", fileRoute);
app.use("/api/v1/documentation", documentationRoute);
app.use("/api/v1/project-messages", projectMessageRoutes);
app.use("/api/v1/direct-messages", directMessageRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  connectDB();
  console.log(`Server running at port ${PORT}`);
});
