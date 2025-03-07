import { Channel } from "../models/channel.model.js";
import { Project } from "../models/project.model.js";
import { ProjectMessage } from "../models/projectMessage.model.js";
import { io } from "../socket/socket.js";

export const createChannel = async (req, res) => {
  try {
    const { name, role, projectId, members, type } = req.body;
    const userId = req.id;

    // Check if project exists and user has permission
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user is project owner
    if (project.created_by.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can create channels",
      });
    }

    // Check if channel with same name exists in project
    const existingChannel = await Channel.findOne({
      projectId,
      name: name.toLowerCase(),
      isDeleted: false,
    });

    if (existingChannel) {
      return res.status(400).json({
        success: false,
        message: "Channel with this name already exists",
      });
    }

    // Add the project owner (userId) to the members array if not already included
    const updatedMembers = members.includes(userId)
      ? members
      : [...members, userId];

    const channel = await Channel.create({
      name: name.toLowerCase(),
      role,
      type,
      projectId,
      createdBy: userId,
      members: updatedMembers,
    });

    await channel.populate("members", "username email profile");

    return res.status(201).json({
      success: true,
      channel,
    });
  } catch (error) {
    console.error("Error creating channel:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating channel",
    });
  }
};

export const getProjectChannels = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.id;

    // Get all channels including defaults from database
    const channels = await Channel.find({
      projectId,
      isDeleted: false,
    }).populate("members", "username email profile");

    return res.status(200).json({
      success: true,
      channels,
    });
  } catch (error) {
    console.error("Error fetching channels:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching channels",
    });
  }
};

export const deleteChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.id;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    // Check if user is project owner
    const project = await Project.findById(channel.projectId);
    if (project.created_by.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can delete channels",
      });
    }

    channel.isDeleted = true;
    await channel.save();

    return res.status(200).json({
      success: true,
      message: "Channel deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting channel:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting channel",
    });
  }
};

export const togglePinMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.id;

    const message = await ProjectMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Check authorization (only message sender or project admin can pin/unpin)
    const project = await Project.findById(message.projectId);
    const isAuthorized =
      message.sender.toString() === userId ||
      project.created_by.toString() === userId ||
      project.members.some(
        (m) => m.user.toString() === userId && m.role === "Admin"
      );

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to pin/unpin messages",
      });
    }

    message.isPinned = !message.isPinned;
    await message.save();

    // Emit socket event for real-time updates
    req.io.to(message.channelId).emit("message_update", message);

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error toggling pin status:", error);
    return res.status(500).json({
      success: false,
      message: "Error toggling pin status",
    });
  }
};



export const postAnnouncement = async (req, res) => {
  try {
    const { channelId, content, attachments } = req.body;
    const userId = req.id;

    // Check if channel exists
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    // Verify user has permission to post announcements
    const project = await Project.findById(channel.projectId);
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
        success: false,
      });
    }

    // Only project owner or admins can post announcements
    const isAuthorized =
      project.created_by.toString() === userId ||
      project.members.some(
        (m) => m.user.toString() === userId && m.role === "Admin"
      );

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to post announcements",
      });
    }

    // Create the announcement
    const announcement = await ProjectMessage.create({
      channelId,
      sender: userId,
      content,
      type: "announcement",
      attachments: attachments || [],
      isPinned: true,
      readBy: [{ user: userId }],
    });

    await announcement.populate("sender", "username email profile");

    // Emit socket event using the imported io instance
    io.to(channelId).emit("new_announcement", announcement);

    return res.status(201).json({
      success: true,
      announcement,
    });
  } catch (error) {
    console.error("Error posting announcement:", error);
    return res.status(500).json({
      success: false,
      message: "Error posting announcement",
      error: error.message,
    });
  }
};





export const getPinnedMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.id;

    // Check channel access
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    const hasAccess = channel.members.some((m) => m.toString() === userId);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view messages",
      });
    }

    // Get pinned messages and announcements
    const pinnedMessages = await ProjectMessage.find({
      channelId,
      isPinned: true,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .populate("sender", "username email profile")
      .populate("readBy.user", "username email profile");

    return res.status(200).json({
      success: true,
      messages: pinnedMessages,
    });
  } catch (error) {
    console.error("Error fetching pinned messages:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching pinned messages",
    });
  }
};


export const deleteAnnouncement = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.id;

    // Find the announcement
    const announcement = await ProjectMessage.findById(messageId);
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found"
      });
    }

    // Check if user is authorized to delete (announcement creator or project admin)
    const channel = await Channel.findById(announcement.channelId);
    const project = await Project.findById(channel.projectId);

    const isAuthorized = 
      announcement.sender.toString() === userId || 
      project.created_by.toString() === userId ||
      project.members.some(m => m.user.toString() === userId && m.role === "Admin");

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this announcement"
      });
    }

    await ProjectMessage.findByIdAndDelete(messageId);

    // Emit socket event for real-time update
    io.to(announcement.channelId).emit("announcement_deleted", messageId);

    return res.status(200).json({
      success: true,
      message: "Announcement deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting announcement",
      error: error.message
    });
  }
};


export const sendMessage = async (req, res) => {
  try {
    const { channelId, content } = req.body;
    const userId = req.id;

    // Check if channel exists
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    // Check if user is a member of the channel
    if (!channel.members.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to send messages in this channel",
      });
    }

    // If it's a role-based channel, verify user has the correct role OR is the project admin
    if (channel.type === "role-based") {
      const project = await Project.findById(channel.projectId);
      const isAdmin = project.created_by.toString() === userId;
      const hasRole = project.members.some(
        (m) => m.user.toString() === userId && m.role === channel.role
      );

      if (!isAdmin && !hasRole) {
        return res.status(403).json({
          success: false,
          message: "You don't have the required role for this channel",
        });
      }
    }

    // Create and save the message
    const message = await ProjectMessage.create({
      channelId,
      sender: userId,
      content,
      type: "message",
    });

    // Populate sender information for the response
    await message.populate("sender", "username email profile");

    // Emit socket event for real-time updates
    io.to(channelId).emit("new_message", message);

    return res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({
      success: false,
      message: "Error sending message",
      error: error.message,
    });
  }
};

// Get messages for a channel
export const getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    // Check if channel exists
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    // Get messages regardless of membership
    const messages = await ProjectMessage.find({
      channelId,
      type: "message",
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("sender", "username email profile")
      .populate("readBy.user", "username profile.profilePhoto");

    // Check if user is a member to mark messages as read
    if (channel.members.includes(userId)) {
      const unreadMessages = messages.filter(
        (msg) => !msg.readBy.some((read) => read.user.toString() === userId)
      );

      if (unreadMessages.length > 0) {
        await Promise.all(
          unreadMessages.map((msg) =>
            ProjectMessage.findByIdAndUpdate(msg._id, {
              $addToSet: { readBy: { user: userId } },
            })
          )
        );
      }
    }

    return res.status(200).json({
      success: true,
      messages: messages.reverse(),
      page,
      limit,
      canInteract: channel.members.includes(userId), // Add this flag
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching messages",
      error: error.message,
    });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.id;

    const message = await ProjectMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Check if user is the message sender
    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this message",
      });
    }

    await ProjectMessage.findByIdAndUpdate(messageId, { isDeleted: true });

    // Emit socket event for real-time update
    io.to(message.channelId).emit("message_deleted", messageId);

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting message",
      error: error.message,
    });
  }
};