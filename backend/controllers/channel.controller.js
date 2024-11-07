import { Channel } from "../models/channel.model.js";
import { Project } from "../models/project.model.js";

// Create a new channel
export const createChannel = async (req, res) => {
  try {
    const { name, type, projectId, allowedRoles } = req.body;
    const userId = req.user._id;

    // Check if project exists and user has permission
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user has permission to create channel
    const isProjectMember = project.members.some(
      (member) => member.user.toString() === userId.toString()
    );

    if (!isProjectMember) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to create channels in this project",
      });
    }

    const channel = await Channel.create({
      name,
      type,
      projectId,
      allowedRoles,
      createdBy: userId,
      members: [{ user: userId, role: "admin" }],
    });

    await channel.populate("members.user", "username email profile");

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

// Get project channels
export const getProjectChannels = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const channels = await Channel.find({
      projectId,
      isDeleted: false,
      $or: [
        { type: "public" },
        {
          type: "private",
          "members.user": userId,
        },
        {
          type: "role-based",
          allowedRoles: {
            $in: project.members.find(
              (m) => m.user.toString() === userId.toString()
            )?.role,
          },
        },
      ],
    }).populate("members.user", "username email profile");

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

// Add member to channel
export const addChannelMember = async (req, res) => {
  try {
    const { channelId, userId, role } = req.body;
    const requesterId = req.user._id;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    // Check if requester has permission
    const requesterMember = channel.members.find(
      (m) => m.user.toString() === requesterId.toString()
    );

    if (!requesterMember || requesterMember.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to add members",
      });
    }

    // Add member if not already in channel
    if (!channel.members.some((m) => m.user.toString() === userId)) {
      channel.members.push({ user: userId, role });
      await channel.save();
    }

    await channel.populate("members.user", "username email profile");

    return res.status(200).json({
      success: true,
      channel,
    });
  } catch (error) {
    console.error("Error adding channel member:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding channel member",
    });
  }
};
