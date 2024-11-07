import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const postProject = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      maxTeamSize,
      location,
      groupId,
      status,
      isOpen,
      openPositions,
      tags,
      skills,
      communicationPlatform,
      communicationLink,
      budgetEstimated,
      budgetCurrent,
      budgetCurrency,
      socialInstagram,
      socialTwitter,
      socialLinkedin,
      socialGithub,
      socialWebsite,
      startDate,
      endDate,
      category
    } = req.body;
    const userId = req.id;

    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    const logo = cloudResponse.secure_url;

    if (
      !title ||
      !description ||
      !requirements ||
      !maxTeamSize ||
      !location ||
      !groupId ||
      !category
    ) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }

    const project = await Project.create({
      title,
      description,
      requirements: requirements.split(","),
      location,
      maxTeamSize,
      group: groupId,
      created_by: userId,
      logo,
      status,
      isOpen,
      openPositions: openPositions ? openPositions.split(",") : [],
      tags: tags ? tags.split(",") : [],
      skills: skills ? skills.split(",") : [],
      communicationPlatform,
      communicationLink,
      budgetEstimated,
      budgetCurrent,
      budgetCurrency,
      socialInstagram,
      socialTwitter,
      socialLinkedin,
      socialGithub,
      socialWebsite,
      startDate,
      endDate,
      category
    });

    return res.status(201).json({
      message: "New project created successfully.",
      project,
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
