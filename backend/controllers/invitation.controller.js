import { Invitation } from "../models/invitation.model.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import { io } from "../index.js";

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

    const inviter = await User.findById(inviterId).select("username");

    const notification = await Notification.create({
      recipient: recipientId,
      type: "invitation",
      title: "New Project Invitation",
      content: `${inviter.username} invited you to their project`,
      link: `/allInvitations`,
      relatedDoc: newInvitation._id,
      docModel: "Invitation",
    });

    io.to(`user_${recipientId}`).emit("new_invitation", newInvitation);
    io.to(`user_${recipientId}`).emit("new_notification", notification);

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

    if (!["accepted", "declined"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status.", success: false });
    }

    const invitation = await Invitation.findById(invitationId);
    if (!invitation) {
      return res.status(404).json({
        message: "Invitation not found.",
        success: false,
      });
    }

    if (invitation.recipient.toString() !== userId) {
      return res.status(403).json({
        message: "Not authorized to update this invitation.",
        success: false,
      });
    }

    invitation.status = status;
    await invitation.save();

    return res.status(200).json({
      message: `Invitation ${status} successfully.`,
      success: true,
      invitation,
    });
  } catch (error) {
    console.error("Error updating invitation status:", error);
    res.status(500).json({
      message: "Server error: " + error.message,
      success: false,
    });
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


export const deleteInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const invitation = await Invitation.findById(id);

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Invitation not found",
      });
    }

    if (
      invitation.inviter.toString() !== req.id &&
      invitation.recipient.toString() !== req.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this invitation",
      });
    }

    await Invitation.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Invitation deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteInvitation:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
