// controllers/channel.controller.js
import { Channel } from "../models/channel.model.js";
import { Project } from "../models/project.model.js";

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
