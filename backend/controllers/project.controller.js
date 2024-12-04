import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";
import { Channel } from "../models/channel.model.js";
import { ProjectMessage } from "../models/projectMessage.model.js";
import { Milestone } from "../models/milestone.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";

export const postProject = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      groupId,
      category,
      skills,
      communication,
      socialLinks,
    } = req.body;

    // Parse JSON strings back to objects
    const parsedRequirements = JSON.parse(requirements);
    const parsedSkills = JSON.parse(skills);
    const parsedCommunication = JSON.parse(communication);
    const parsedSocialLinks = JSON.parse(socialLinks);

    if (!title || !description || !requirements || !groupId || !category) {
      return res.status(400).json({
        message: "Required fields are missing.",
        success: false,
      });
    }

    // Handle file upload
    let logo;
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      logo = cloudResponse.secure_url;
    }

    const project = await Project.create({
      title,
      description,
      requirements: parsedRequirements,
      group: groupId,
      created_by: req.id,
      logo,
      skills: parsedSkills,
      communication: parsedCommunication,
      socialLinks: parsedSocialLinks,
      category,
      members: [
        {
          user: req.id,
          role: "Admin",
        },
      ],
    });

    const defaultChannels = [
      {
        name: "general",
        type: "default",
        projectId: project._id,
        createdBy: req.id,
        members: [req.id],
        isDefault: true,
      },
      {
        name: "announcements",
        type: "announcement",
        projectId: project._id,
        createdBy: req.id,
        members: [req.id],
        isDefault: true,
      },
    ];

    await Channel.insertMany(defaultChannels);
    // Add project to user's projects
    await User.findByIdAndUpdate(req.id, {
      $push: { project: project._id },
    });

    return res.status(201).json({
      message: "New project created successfully.",
      project,
      success: true,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = keyword
      ? {
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        }
      : {};
    console.log("Query:", query);
    const projects = await Project.find(query)
      .populate("group")
      .sort({ createdAt: -1 });
    console.log("Projects found:", projects.length);

    if (!projects || projects.length === 0) {
      return res.status(200).json({
        projects: [],
        success: true,
      });
    }

    return res.status(200).json({
      projects,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId).populate({
      path: "requests",
    });

    if (!project) {
      return res.status(404).json({
        message: "Projects not found.",
        success: false,
      });
    }
    return res.status(200).json({ project, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        success: false,
      });
    }

    const user = await User.findById(userId).select(
      "username email profession profile.profilePhoto profile.bio"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.error("Error in getUserById:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

export const getAdminProjects = async (req, res) => {
  try {
    const adminId = req.id;
    const projects = await Project.find({ created_by: adminId })
      .populate({ path: "group" })
      .sort({ createdAt: -1 });

    if (!projects) {
      return res.status(404).json({
        message: "Projects not found.",
        success: false,
      });
    }
    return res.status(200).json({
      projects,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const assignMemberToProject = async (req, res) => {
  try {
    const { projectId, memberId, role } = req.body;

    if (!projectId || !memberId || !role) {
      return res.status(400).json({
        message: "Project ID, Member ID, and Role are required.",
        success: false,
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
        success: false,
      });
    }

    // Check if the member is already assigned to the project
    const existingMember = project.members.find(
      (member) => member.user.toString() === memberId
    );

    if (existingMember) {
      // If the member exists, update the role
      existingMember.role = role;
    } else {
      project.members.push({ user: memberId, role });
    }

    if (!project.requirements.includes(role)) {
      return res.status(400).json({
        message: "Invalid role for this project.",
        success: false,
      });
    }

    await project.save();

    await Channel.syncDefaultChannels(projectId, memberId);

    return res.status(200).json({
      message: "Member assigned to project successfully.",
      success: true,
      project,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  let session;
  try {
    session = await mongoose.startSession();
    await session.startTransaction();

    const { id } = req.params;
    const userId = req.id;

    const project = await Project.findById(id);

    if (!project) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.created_by.toString() !== userId) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: "Only project owner can delete the project",
      });
    }

    const channels = await Channel.find({ projectId: id });
    const channelIds = channels.map((channel) => channel._id);

    // Delete all related data within the transaction
    await Promise.all([
      Task.deleteMany({ projectId: id }, { session }),
      Milestone.deleteMany({ projectId: id }, { session }),
      ProjectMessage.deleteMany(
        { channelId: { $in: channelIds } },
        { session }
      ),
      Channel.deleteMany({ projectId: id }, { session }),
      Project.findByIdAndDelete(id, { session }),
      User.updateMany({ project: id }, { $pull: { project: id } }, { session }),
    ]);

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
    }
    console.error("Error deleting project:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting project",
    });
  } finally {
    if (session) {
      session.endSession();
    }
  }
};
