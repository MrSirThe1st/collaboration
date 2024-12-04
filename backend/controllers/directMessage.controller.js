// controllers/directMessage.controller.js
import { DirectMessage } from "../models/directMessage.model.js";
import { Conversation } from "../models/directMessage.model.js";
import { User } from "../models/user.model.js";

// Send a direct message
export const sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, recipientId],
      });
    }

    const message = await DirectMessage.create({
      sender: senderId,
      recipient: recipientId,
      content,
      conversation: conversation._id,
    });

    conversation.lastMessage = message._id;
    await conversation.save();

    await message.populate([
      { path: "sender", select: "username email profile" },
      { path: "recipient", select: "username email profile" },
    ]);

    return res.status(201).json({
      success: true,
      message,
      conversation,
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

// Get conversation with a specific user
export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params; // ID of the other user
    const currentUserId = req.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    // Get messages from both directions
    const messages = await DirectMessage.find({
      $or: [
        { sender: currentUserId, recipient: userId },
        { sender: userId, recipient: currentUserId },
      ],
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("sender", "username email profile")
      .populate("recipient", "username email profile");

    return res.status(200).json({
      success: true,
      messages: messages.reverse(),
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversation",
    });
  }
};

// Get list of conversations (unique users the current user has messaged with)
export const getConversationList = async (req, res) => {
  try {
    const userId = req.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("lastMessage")
      .populate("participants", "username email profile");

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
    });
  }
};

// Mark messages as read
export const markDirectMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.id;

    const message = await DirectMessage.findOneAndUpdate(
      {
        _id: messageId,
        recipient: userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      },
      { new: true }
    );

    if (message) {
      // Emit socket event if socket.io is configured
      if (req.io) {
        req.io.to(message.sender.toString()).emit("message_read", messageId);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Message marked as read",
    });
  } catch (error) {
    console.error("Error marking message as read:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark message as read",
    });
  }
};

// Delete a direct message
export const deleteDirectMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.id;

    const message = await DirectMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Verify message ownership
    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own messages",
      });
    }

    // Soft delete
    message.isDeleted = true;
    await message.save();

    // Emit socket event if socket.io is configured
    if (req.io) {
      req.io
        .to(message.sender.toString())
        .to(message.recipient.toString())
        .emit("direct_message_deleted", messageId);
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting direct message:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete message",
    });
  }
};

// Edit a direct message
export const editDirectMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.id;

    const message = await DirectMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Verify message ownership
    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own messages",
      });
    }

    // Save old content to edit history
    message.editHistory.push({
      content: message.content,
      editedAt: new Date(),
    });

    // Update message
    message.content = content;
    message.isEdited = true;
    await message.save();

    await message.populate("sender", "username email profile");
    await message.populate("recipient", "username email profile");

    // Emit socket event if socket.io is configured
    if (req.io) {
      req.io
        .to(message.sender.toString())
        .to(message.recipient.toString())
        .emit("direct_message_updated", message);
    }

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error editing direct message:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to edit message",
    });
  }
};