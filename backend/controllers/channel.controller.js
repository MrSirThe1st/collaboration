import { Channel } from "../models/channel.model.js";
import { Project } from "../models/project.model.js";
import { Message } from "../models/message.model.js";

export const createChannel = async (req, res) => {
  try {
    const { name, role, projectId, members } = req.body;
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

    const channel = await Channel.create({
      name: name.toLowerCase(),
      role,
      projectId,
      createdBy: userId,
      members,
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

    // Fetch custom channels from database
    const customChannels = await Channel.find({
      projectId,
      isDeleted: false,
    }).populate("members", "username email profile");

    // Combine with default channels
    const allChannels = [
      { _id: "general", name: "general", type: "public", projectId },
      {
        _id: "announcements",
        name: "announcements",
        type: "announcement",
        projectId,
      },
      ...customChannels,
    ];

    return res.status(200).json({
      success: true,
      channels: allChannels,
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
        success: false,
        message: "Project not found",
      });
    }

    // Only project owner or admins can post announcements
    const isAuthorized = project.created_by.toString() === userId || 
      project.members.some(m => m.user.toString() === userId && m.role === "Admin");

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to post announcements",
      });
    }

    // Create the announcement
    const announcement = await Message.create({
      channelId,
      sender: userId,
      content,
      type: "announcement",
      attachments,
      isPinned: true, // Announcements are pinned by default
      readBy: [{ user: userId }],
    });

    await announcement.populate("sender", "username email profile");

    // Emit socket event for real-time updates
    req.io.to(channelId).emit("new_announcement", announcement);

    return res.status(201).json({
      success: true,
      announcement,
    });
  } catch (error) {
    console.error("Error posting announcement:", error);
    return res.status(500).json({
      success: false,
      message: "Error posting announcement",
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

    const hasAccess = channel.members.some(m => m.toString() === userId);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view messages",
      });
    }

    // Get pinned messages and announcements
    const pinnedMessages = await Message.find({
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

export const togglePinMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.id;

    const message = await Message.findById(messageId);
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
      project.members.some(m => m.user.toString() === userId && m.role === "Admin");

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
