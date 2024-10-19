import { Request } from "../models/request.model.js";
import { Project } from "../models/project.model.js";

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
      message: "project applied successfully.",
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
      },
    });
    if (!project) {
      return res.status(404).json({
        message: "project not found.",
        success: false,
      });
    }
    return res.status(200).json({
      project,
      succees: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;
    if (!status) {
      return res.status(400).json({
        message: "status is required",
        success: false,
      });
    }

    const request = await Request.findOne({ _id: requestId });
    if (!request) {
      return res.status(404).json({
        message: "request not found.",
        success: false,
      });
    }

    // update the status
    request.status = status.toLowerCase();
    await request.save();

    return res.status(200).json({
      message: "Status updated successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
