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
import taskRoute from "./routes/task.route.js";
import milestoneRoute from "./routes/milestone.route.js";
import fileRoute from "./routes/file.route.js";
import documentationRoute from "./routes/documentation.route.js";
import projectMessageRoutes from "./routes/projectMessage.route.js";
import directMessageRoutes from "./routes/directMessage.route.js";
import notificationRoute from "./routes/notification.route.js";
import professionRoutes from "./routes/profession.route.js";
import http from "http";
import { Server } from "socket.io";
import { setupCors } from "./middlewares/cors.js";
import { Notification } from "./models/notification.model.js";



dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || [
      "http://localhost:5174",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000, // Close connection after 60s of inactivity
});

// Map to store user socket IDs
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    // Join user's personal room
    socket.join(`user_${userId}`);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle direct messages
  socket.on("new_message", async (message) => {
    try {
      const recipientSocketId = userSocketMap[message.recipient];

      // Create notification
      const notification = await Notification.create({
        recipient: message.recipient,
        type: "message",
        title: "New Message",
        content: `${message.sender.username} sent you a message`,
        link: `/inbox?conversation=${message.conversation}`,
        relatedDoc: message._id,
        docModel: "DirectMessage",
      });

      // Emit events to recipient
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("new_direct_message", message);
        io.to(recipientSocketId).emit("new_notification", notification);
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  // Handle typing indicators
  socket.on("typing", ({ recipientId, isTyping }) => {
    const recipientSocketId = userSocketMap[recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("user_typing", {
        userId,
        isTyping,
      });
    }
  });

  // Handle disconnection with cleanup
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (userId) {
      delete userSocketMap[userId];
      socket.leave(`user_${userId}`);
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Make io available throughout the app
app.set("io", io);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Setup CORS
setupCors(app);

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://yippieapp.com ",
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
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/professions", professionRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  connectDB();
  console.log(`Server running at port ${PORT}`);
});

export { io };
