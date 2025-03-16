// socket/socket.js
import { Server } from "socket.io";
import { Notification } from "../models/notification.model.js";

export function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: ["https://yippieapp.com", "https://www.yippieapp.com"],
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000, // Close connection after 60s of inactivity
  });

  // Map to store user socket IDs
  const userSocketMap = new Map(); // Using Map for better performance and cleaner code

  // User socket ID mapping (for backward compatibility)
  const getReceiverSocketId = (receiverId) => {
    return userSocketMap.get(receiverId);
  };

  // Channel mapping
  const channelMap = new Map(); // {channelId: Set of socket IDs}

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId;

    if (userId && userId !== "undefined") {
      // Add user to socket map
      userSocketMap.set(userId, socket.id);

      // Join user-specific room
      socket.join(`user_${userId}`);

      // Notify all users about online status
      io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
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

    // Handle notifications
    socket.on("notification", async (data) => {
      try {
        const notification = await Notification.createNotification(data);
        const recipientSocket = userSocketMap.get(data.recipient);

        if (recipientSocket) {
          io.to(recipientSocket).emit("new_notification", notification);
        }
      } catch (error) {
        console.error("Error creating notification:", error);
      }
    });

    // Handle new messages
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

    // Handle invitations
    socket.on("new_invitation", (invitation) => {
      const recipientSocketId = userSocketMap.get(invitation.recipient);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("new_invitation", invitation);
      }
    });

    // Handle typing indicators
    socket.on("typing", ({ recipientId, isTyping }) => {
      const recipientSocketId = userSocketMap.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("user_typing", {
          userId,
          isTyping,
        });
      }
    });

    // Handle socket disconnection with clean up
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      // Clean up channel memberships
      channelMap.forEach((sockets, channelId) => {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            channelMap.delete(channelId);
          }
        }
      });

      // Remove user from socket map
      if (userId) {
        userSocketMap.delete(userId);
      }

      // Update online users list
      io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    });
  });

  // Export io instance for use in controllers
  return { io, getReceiverSocketId };
}
