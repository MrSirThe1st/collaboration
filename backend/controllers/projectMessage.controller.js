// projectMessage.controller.js
import { ProjectMessage } from "../models/projectMessage.model.js";
import { Project } from "../models/project.model.js";

export const sendAnnouncement = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { content } = req.body;
    const userId = req.id;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Verify sender is project owner
    if (project.created_by.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can send announcements",
      });
    }

    const message = await ProjectMessage.create({
      projectId,
      sender: userId,
      content,
      type: "announcement",
    });

    await message.populate("sender", "username email profile");

    return res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error sending announcement:", error);
    return res.status(500).json({
      success: false,
      message: "Error sending announcement",
    });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const { projectId } = req.params;

    const messages = await ProjectMessage.find({
      projectId,
      type: "announcement",
      status: "active",
    })
      .sort({ createdAt: -1 })
      .populate("sender", "username email profile");

    return res.status(200).json({
      success: true,
      announcements: messages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching announcements",
    });
  }
};

