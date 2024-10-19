import { Invitation } from "../models/invitation.model.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";

export const createInvitation = async (req, res) => {
  try {
    const { recipientId, projectId, role, message } = req.body;
    const inviterId = req.id;
    console.log(req.body);

    // Validate project and recipient
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
        success: false,
      });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res
        .status(404)
        .json({ message: "Recipient not found.", success: false });
    }

    // Check if the user has already been invited to the project
    const existingInvitation = await Invitation.findOne({
      project: projectId,
      recipient: recipientId,
    });
    if (existingInvitation) {
      return res.status(400).json({
        message: "User has already been invited to this project.",
        success: false,
      });
    }

    // Create a new invitation
    const newInvitation = await Invitation.create({
      project: projectId,
      inviter: inviterId,
      recipient: recipientId,
      role: role,
      message: message,
    });

    return res.status(201).json({
      message: "Invitation sent successfully.",
      success: true,
      invitation: newInvitation,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error.", success: false });
  }
};

// Get invitations received by a user
export const getReceivedInvitations = async (req, res) => {
  try {
    const userId = req.id;
    const invitations = await Invitation.find({ recipient: userId })
      .populate(
        "project inviter",
        "title description requirements members logo "
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, invitations });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error.", success: false });
  }
};

// Update invitation status
export const updateInvitationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const invitationId = req.params.id;
    const userId = req.id;

    if (!["accepted", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status.", success: false });
    }

    const invitation = await Invitation.findById(invitationId);
    if (!invitation || invitation.recipient.toString() !== userId) {
      return res.status(404).json({
        message: "Invitation not found or not authorized.",
        success: false,
      });
    }

    // Update the status
    invitation.status = status;
    await invitation.save();

    return res.status(200).json({
      message: "Invitation status updated successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error.", success: false });
  }
};

// Get invitations sent by a user
export const getSentInvitations = async (req, res) => {
  try {
    const inviterId = req.id;
    console.log("Fetching invitations for inviterId:", inviterId);
    const invitations = await Invitation.find({ inviter: inviterId })
      .sort({ createdAt: -1 })
      .populate({
        path: "project recipient",
        select: "title username",
      });

    console.log("Fetched invitations:", invitations);

    if (!invitations || invitations.length === 0) {
      return res.status(200).json({
        message: "No invitations found.",
        success: true,
        invitations: [],
      });
    }

    return res.status(200).json({
      success: true,
      invitations,
    });
  } catch (error) {
    console.error("Error in getSentInvitations:", error);
    res.status(500).json({
      message: "Server error: " + error.message,
      success: false,
    });
  }
};
