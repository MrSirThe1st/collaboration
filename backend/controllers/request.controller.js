import { Request } from "../models/request.model.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";

export const sendRequest = async (req, res) => {
  try {
    const userId = req.id;
    const projectId = req.params.id;
    if (!projectId) {
      return res.status(400).json({
        message: "project id is required.",
        success: false,
      });
    }
    // check if the user has already requested to be added to a project
    const existingRequest = await Request.findOne({
      project: projectId,
      requester: userId,
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You have already applied for this projects",
        success: false,
      });
    }

    // check if the projects exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        message: "project not found",
        success: false,
      });
    }
    // create a new Request
    const newRequest = await Request.create({
      project: projectId,
      requester: userId,
    });

    project.requests.push(newRequest._id);
    await project.save();
    return res.status(201).json({
      message: "request sent successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getRequestsSent = async (req, res) => {
  try {
    const userId = req.id;
    const request = await Request.find({ requester: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "project",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "group",
          options: { sort: { createdAt: -1 } },
        },
      });
    if (!request) {
      return res.status(404).json({
        message: "No requests",
        success: false,
      });
    }
    return res.status(200).json({
      request,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getRequesters = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId).populate({
      path: "requests",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "requester",
        select: "username email profession profile role ",
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
        success: false,
      });
    }

    return res.status(200).json({
      project,
      success: true,
    });
  } catch (error) {
    console.error("Error in getRequesters:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
        success: false,
      });
    }

    // Validate status value
    const validStatuses = ["thinking", "accepted", "rejected"];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        message: "Invalid status value",
        success: false,
      });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({
        message: "Request not found",
        success: false,
      });
    }

    // Update the status
    request.status = status.toLowerCase();
    await request.save();

    return res.status(200).json({
      message: "Status updated successfully",
      success: true,
      request,
    });
  } catch (error) {
    console.error("Error in updateStatus:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({
        message: "Request not found",
        success: false,
      });
    }

    const project = await Project.findById(request.project);
    if (!project) {
      return res.status(404).json({
        message: "Associated project not found",
        success: false,
      });
    }

    if (project.created_by.toString() !== userId) {
      return res.status(403).json({
        message: "Not authorized to delete this request",
        success: false,
      });
    }

    // Remove request from project's requests array
    project.requests = project.requests.filter(
      (reqId) => reqId.toString() !== id
    );
    await project.save();

    // Delete the request
    await Request.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Request deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in deleteRequest:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};
