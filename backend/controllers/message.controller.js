import { Message } from "../models/message.model.js";
import { Channel } from "../models/channel.model.js";

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { channelId, content, type = "text", attachments = [] } = req.body;
    const userId = req.user._id;

    // Check channel exists and user has access
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    const hasAccess = channel.members.some(
      (m) => m.user.toString() === userId.toString()
    );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to send messages in this channel",
      });
    }

    const message = await Message.create({
      channelId,
      sender: userId,
      content,
      type,
      attachments,
      readBy: [{ user: userId }],
    });

    await message.populate("sender", "username email profile");

    // Emit socket event for real-time updates
    req.io.to(channelId).emit("new_message", message);

    return res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({
      success: false,
      message: "Error sending message",
    });
  }
};

// Get channel messages
export const getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user._id;

    // Check channel access
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    const hasAccess = channel.members.some(
      (m) => m.user.toString() === userId.toString()
    );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view messages",
      });
    }

    const messages = await Message.find({
      channelId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("sender", "username email profile")
      .populate("readBy.user", "username email profile");

    return res.status(200).json({
      success: true,
      messages: messages.reverse(),
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching messages",
    });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id;

    await Message.updateMany(
      {
        channelId,
        "readBy.user": { $ne: userId },
      },
      {
        $addToSet: {
          readBy: { user: userId },
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return res.status(500).json({
      success: false,
      message: "Error marking messages as read",
    });
  }
};
