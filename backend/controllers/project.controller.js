import { Project } from "../models/project.model.js";

export const postProject = async (req, res) => {
  try {
    const { title, description, requirements, maxTeamSize, location, groupId } =
      req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !maxTeamSize ||
      !location ||
      !groupId
    ) {
      return res.status(400).json({
        message: "Somethin is missing.",
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
    });
    return res.status(201).json({
      message: "New project created successfully.",
      project,
      success: true,
    });
  } catch (error) {
    console.log(error);
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
    console.log("Query:", query); // Log the query object
    const projects = await Project.find(query)
      .populate("group")
      .sort({ createdAt: -1 });
    console.log("Projects found:", projects.length); // Log the number of projects found

    if (!projects || projects.length === 0) {
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
      // If the member exists, add the new role if it's not already there
      if (!existingMember.roles.includes(role)) {
        existingMember.roles.push(role);
      }
    } else {
      // If the member doesn't exist, add them with the new role
      project.members.push({ user: memberId, roles: [role] });
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
