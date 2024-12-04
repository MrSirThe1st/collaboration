// controllers/documentation.controller.js
import { Documentation } from "../models/documentation.model.js";
import { Project } from "../models/project.model.js";

export const getDocumentation = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Get all documentation for the project
    const docs = await Documentation.findByProject(projectId);

    return res.status(200).json({
      success: true,
      documentation: docs,
    });
  } catch (error) {
    console.error("Error in getDocumentation:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const addDocumentation = async (req, res) => {
  try {
    const { title, content, link, type, projectId } = req.body;
    const userId = req.id;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const doc = await Documentation.create({
      title,
      content,
      link,
      type,
      projectId,
      createdBy: userId,
      lastUpdatedBy: userId,
    });

    await doc.populate("createdBy", "username profile.profilePhoto");

    return res.status(201).json({
      success: true,
      documentation: doc,
    });
  } catch (error) {
    console.error("Error in addDocumentation:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateDocumentation = async (req, res) => {
  try {
    const { docId } = req.params;
    const { title, content, link } = req.body;
    const userId = req.id;

    const doc = await Documentation.findById(docId);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Documentation not found",
      });
    }

    // Only creator or project owner can update
    if (doc.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this documentation",
      });
    }

    doc.title = title || doc.title;
    doc.content = content || doc.content;
    doc.link = link || doc.link;
    doc.lastUpdatedBy = userId;

    await doc.save();
    await doc.populate("createdBy", "username profile.profilePhoto");

    return res.status(200).json({
      success: true,
      documentation: doc,
    });
  } catch (error) {
    console.error("Error in updateDocumentation:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteDocumentation = async (req, res) => {
  try {
    const { projectId, docId } = req.params;
    const userId = req.id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Find and remove the documentation
    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId },
      {
        $pull: {
          documentation: {
            _id: docId,
            createdBy: userId, // Ensure only creator can delete
          },
        },
      },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: "Documentation not found or unauthorized to delete",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Documentation deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteDocumentation:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
