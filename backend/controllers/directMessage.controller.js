// controllers/directMessage.controller.js
import { DirectMessage } from "../models/directMessage.model.js";
import { Conversation } from "../models/directMessage.model.js";
import { User } from "../models/user.model.js";
import { io } from "../index.js";
import { Notification } from "../models/notification.model.js";

// Send a direct message
export const sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.id;

    // First find or create the conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, recipientId],
      });
    }

    // Create the message
    const message = await DirectMessage.create({
      sender: senderId,
      recipient: recipientId,
      content,
      conversation: conversation._id,
    });

    // Update conversation's last message
    conversation.lastMessage = message._id;
    await conversation.save();

    // Populate the message with sender and recipient details
    await message.populate([
      { path: "sender", select: "username email profile profession skills" },
      { path: "recipient", select: "username email profile profession skills" },
    ]);

    // Create notification
    const senderUser = await User.findById(senderId).select("username");
    const notification = await Notification.create({
      recipient: recipientId,
      type: "message",
      title: "New Message",
      content: `${senderUser.username} sent you a message`,
      link: `/inbox?conversation=${conversation._id}`,
      relatedDoc: message._id,
      docModel: "DirectMessage",
    });

    // Emit socket events
    io.to(`user_${senderId}`).emit("new_direct_message", message);
    io.to(`user_${recipientId}`).emit("new_direct_message", message);
    io.to(`user_${recipientId}`).emit("new_notification", notification);

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
      error: error.message, // Add error message for debugging
    });
  }
};


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
      .populate("sender", "username email profile skills")
      .populate("recipient", "username email profile skills");

    // Mark related notifications as read
    await Notification.updateMany(
      { 
        recipient: currentUserId,
        type: "message",
        read: false,
        relatedDoc: { $in: messages.map(msg => msg._id) }
      },
      { $set: { read: true } }
    );

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
      .populate("participants", "username email profile profession skills");

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

    await message.populate(
      "sender",
      "username email profile profession skills"
    );
    await message.populate(
      "recipient",
      "username email profile profession skills"
    );

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

export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.id;

    // Find the conversation and verify user is a participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this conversation",
      });
    }

    // Delete all messages in the conversation
    await DirectMessage.deleteMany({ conversation: conversationId });

    // Delete the conversation itself
    await Conversation.findByIdAndDelete(conversationId);

    // Notify other participant through socket
    const otherParticipant = conversation.participants.find(
      (p) => p.toString() !== userId
    );
    io.to(otherParticipant.toString()).emit(
      "conversation_deleted",
      conversationId
    );

    return res.status(200).json({
      success: true,
      message: "Conversation and messages deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Edit a message
export const editMessage = async (req, res) => {
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

    // Check if user is the sender
    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit this message",
      });
    }

    // Check if message is within edit time limit (5 minutes)
    const timeLimit = 5 * 60 * 1000; // 5 minutes in milliseconds
    if (Date.now() - message.createdAt > timeLimit) {
      return res.status(400).json({
        success: false,
        message: "Message can no longer be edited",
      });
    }

    message.content = content;
    message.isEdited = true;
    message.editedAt = Date.now();
    await message.save();

    // Populate necessary fields
    await message.populate(
      "sender",
      "username email profile profession skills"
    );

    // Notify participants through socket
    const conversation = await Conversation.findById(message.conversation);
    conversation.participants.forEach((participantId) => {
      io.to(participantId.toString()).emit("message_edited", message);
    });

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error editing message:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
