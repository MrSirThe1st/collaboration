import { Message } from "../models/message.model.js";
import { Channel } from "../models/channel.model.js";

// Send message
const isSpecialChannel = (channelId) =>
  ["general", "announcements"].includes(channelId);

export const sendMessage = async (req, res) => {
  try {
    const { id: channelId } = req.params;
    const userId = req.id;

    // Check if request is FormData or JSON
    const content = req.body.content;

    console.log("Received message data:", {
      content,
      channelId,
      userId,
      hasAttachments: !!req.files,
    });

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    // Build message object
    const messageData = {
      channelId,
      sender: userId,
      content: content.trim(),
      type: "text",
      readBy: [{ user: userId }],
    };

    // Add attachments if present
    if (req.files && req.files.length > 0) {
      messageData.attachments = req.files.map((file) => ({
        type: file.mimetype.startsWith("image/") ? "image" : "file",
        url: file.path,
        filename: file.originalname,
        filesize: file.size,
        mimetype: file.mimetype,
      }));
    }

    const message = await Message.create(messageData);
    await message.populate("sender", "username email profile");

    // Emit socket event
    req.io?.to(channelId).emit("new_message", message);

    return res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error sending message",
    });
  }
};



// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const { id: channelId } = req.params;
    const userId = req.id;

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

export const getGeneralMessages = async (req, res) => {
  
  try {
    const messages = await Message.find({
      channelId: "general",
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("sender", "username email profile")
      .populate("readBy.user", "username email profile");

    return res.status(200).json({
      success: true,
      messages: messages.reverse(),
    });
  } catch (error) {
    console.error("Error fetching general messages:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching messages",
    });
  }
};

export const getAnnouncementMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      channelId: "announcements",
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .populate("sender", "username email profile")
      .populate("readBy.user", "username email profile");

    return res.status(200).json({
      success: true,
      messages: messages.reverse(),
    });
  } catch (error) {
    console.error("Error fetching announcement messages:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching messages",
    });
  }
};


export const getChannelMessages = async (req, res) => {
  try {
    const { id: channelId } = req.params;

    const messages = await Message.find({
      channelId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .populate("sender", "username email profile")
      .populate("readBy.user", "username email profile");

    return res.status(200).json({
      success: true,
      messages: messages.reverse(),
    });
  } catch (error) {
    console.error("Error in getChannelMessages:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching messages",
    });
  }
};