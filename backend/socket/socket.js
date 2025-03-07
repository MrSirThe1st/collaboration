import { Server } from "socket.io";
import http from "http";
import express from "express";
import { Notification } from "../models/notification.model.js";

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
const userSocketMap = new Map(); // {userId: socketId}

// Channel mapping
const channelMap = new Map(); // {channelId: Set of socket IDs}

// Function to get the receiver's socket ID
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap.get(receiverId);
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    socket.join(`user_${userId}`);
    userSocketMap.set(userId, socket.id);
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

  // Handle joining DM rooms
  socket.on("join_dm", (chatId) => {
    socket.join(`dm_${chatId}`);
  });

  // Handle leaving DM rooms
  socket.on("leave_dm", (chatId) => {
    socket.leave(`dm_${chatId}`);
  });
  // Notify all connected users about online users
  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

  // Handle notifications
  socket.on("notification", async (data) => {
    const notification = await Notification.createNotification(data);
    const recipientSocket = userSocketMap.get(data.recipient);

    if (recipientSocket) {
      io.to(recipientSocket).emit("new_notification", notification);
    }
  });

 socket.on("disconnect", () => {
   console.log("User disconnected:", socket.id);

   channelMap.forEach((users, channelId) => {
     if (users.has(socket.id)) {
       users.delete(socket.id);
       if (users.size === 0) {
         channelMap.delete(channelId);
       }
     }
   });

   userSocketMap.delete(userId);
   io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
 });

  socket.on("new_message", async (message) => {
    try {
      const recipientSocketId = userSocketMap.get(message.recipient);
      const notification = await Notification.createNotification({
        recipient: message.recipient,
        type: "message",
        title: "New Message",
        content: `${message.sender.username} sent you a message`,
        link: `/inbox?conversation=${message.conversation}`,
        relatedDoc: message._id,
        docModel: "DirectMessage",
      });

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("new_notification", notification);
        io.to(recipientSocketId).emit("new_direct_message", {
          ...message,
          conversationId: message.conversation,
        });
      }
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  });

  socket.on("new_invitation", (invitation) => {
    const recipientSocketId = userSocketMap.get(invitation.recipient);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("new_invitation", invitation);
    }
  });

  socket.on("typing", ({ recipientId, isTyping }) => {
    const recipientSocketId = userSocketMap[recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("user_typing", {
        userId: socket.userId,
        isTyping,
      });
    }
  });
});

// Export the server and io instance
export { server, io };
