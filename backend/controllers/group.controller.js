import { Group } from "../models/group.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import mongoose from "mongoose";

export const createGroup = async (req, res) => {
  try {
    const { name } = req.body; 
    const file = req.file; 

    if (!name) {
      return res.status(400).json({
        message: "Group name is required.",
        success: false,
      });
    }

    let group = await Group.findOne({ name });
    // if (group) {
    //   return res.status(400).json({
    //     message: "You can't register the same group.",
    //     success: false,
    //   });
    // }

    let cover = null; 
    if (file) {
      const fileUri = getDataUri(file); 
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content); 
      cover = cloudResponse.secure_url; 
    }

    group = await Group.create({
      name,
      userId: req.id,
      cover, 
    });

    return res.status(201).json({
      message: "Group created successfully.",
      group,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error.",
      success: false,
    });
  }
};
export const getGroup = async (req, res) => {
  try {
    const userId = req.id;
    const groups = await Group.find({ userId });
    if (!groups) {
      return res.status(404).json({
        message: "Groups not found.",
        success: false,
      });
    }
    return res.status(200).json({
      groups,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};


export const getGroupById = async (req, res) => {
  try {
    const groupId = req.params.id;
    const group = await Group.findById(groupId).populate(
      "members",
      "username email skills profession profile.profilePhoto"
    );

    if (!group) {
      return res.status(404).json({
        message: "Group not found.",
        success: false,
      });
    }

    return res.status(200).json({
      group,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error.",
      success: false,
    });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const { name, status } = req.body;
    const updateData = { name, status };

    if (req.file) {
      try {
        const fileUri = getDataUri(req.file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        updateData.cover = cloudResponse.secure_url;
      } catch (uploadError) {
        console.error("File upload error:", uploadError);
        return res.status(400).json({
          message: "Error uploading file",
          success: false,
          error: uploadError.message,
        });
      }
    }

    const group = await Group.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!group) {
      return res.status(404).json({
        message: "Group not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Group information updated successfully.",
      success: true,
      group, // Return updated group data
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      message: "Error updating group",
      success: false,
      error: error.message,
    });
  }
};


export const addMemberToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    console.log("Received request to add user to group");
    console.log("Group ID:", groupId);
    console.log("User ID:", userId);

  
    const group = await Group.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: userId } },
      { new: true }
    );

    if (!group) {
      console.log("Group not found with ID:", groupId);
      return res.status(404).json({
        message: "Group not found.",
        success: false,
      });
    }

    console.log("Group found:", group.name);

   
    const userUpdateResult = await User.findByIdAndUpdate(userId, {
      $addToSet: { "profile.groups": groupId },
    });

    if (!userUpdateResult) {
      console.log("User not found with ID:", userId);
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    console.log("User's group list updated:", userUpdateResult.profile.groups);

    console.log("User added to group successfully:", group.name);
    return res.status(200).json({
      message: "Member added to group successfully.",
      group,
      success: true,
    });
  } catch (error) {
    console.error("Error in addMemberToGroup:", error); 
    return res.status(500).json({
      message: "Server error.",
      success: false,
    });
  }
};


export const deleteGroup = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const userId = req.id;

    // Find the group
    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Check if current user is the admin
    if (group.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only group admin can delete the group",
      });
    }

    // Check for existing projects in the group
    const projectsCount = await Project.countDocuments({ group: id });
    if (projectsCount > 0) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete group with existing projects",
      });
    }

    // Delete the group and clean up references
    await Promise.all([
      Group.findByIdAndDelete(id, { session }),
      // Remove group reference from all users
      User.updateMany(
        { "profile.groups": id },
        { $pull: { "profile.groups": id } },
        { session }
      ),
    ]);

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Group deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error deleting group:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting group",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};