import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// User socket ID mapping
const userSocketMap = {}; // {userId: socketId}

// Channel mapping
const channelMap = new Map(); // {channelId: Set of socket IDs}

// Function to get the receiver's socket ID
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // Handle joining channels
  socket.on("join_channel", (channelId) => {
    socket.join(channelId);

    if (!channelMap.has(channelId)) {
      channelMap.set(channelId, new Set());
    }
    channelMap.get(channelId).add(socket.id);

    console.log(`User ${userId} joined channel: ${channelId}`);
  });

  // Handle leaving channels
  socket.on("leave_channel", (channelId) => {
    socket.leave(channelId);

    const channelUsers = channelMap.get(channelId);
    if (channelUsers) {
      channelUsers.delete(socket.id);
      if (channelUsers.size === 0) {
        channelMap.delete(channelId);
      }
    }

    console.log(`User ${userId} left channel: ${channelId}`);
  });

  // Notify all connected users about online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Clean up channel memberships
    channelMap.forEach((users, channelId) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        if (users.size === 0) {
          channelMap.delete(channelId);
        }
      }
    });

    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Export the server and io instance
export { server, io };
