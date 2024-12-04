import { File } from "../models/file.model.js";
import { Folder } from "../models/folder.model.js";
import { Project } from "../models/project.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const uploadFile = async (req, res) => {
  try {
    const { projectId, folderId = "root" } = req.body;
    const userId = req.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    // Upload file to Cloudinary
    const fileUri = getDataUri(req.file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
      resource_type: "auto",
      folder: `projects/${projectId}`,
      flags: "attachment",
      type: "private",
      access_mode: "authenticated",
    });
    // Create file record
    const file = await File.create({
      name: req.file.originalname,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: cloudResponse.secure_url,
      projectId,
      folderId,
      uploadedBy: userId,
      path: folderId === "root" ? "/root" : await getFolderPath(folderId),
      format: req.file.originalname.split(".").pop().toLowerCase(),
    });

    return res.status(201).json({
      success: true,
      file,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message,
    });
  }
};

export const createFolder = async (req, res) => {
  try {
    const { name, projectId, parentId = "root" } = req.body;
    const userId = req.id;

    // Validate project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if folder with same name exists in the same location
    const existingFolder = await Folder.findOne({
      name,
      projectId,
      parentId,
      isDeleted: false,
    });

    if (existingFolder) {
      return res.status(400).json({
        success: false,
        message: "Folder with this name already exists in this location",
      });
    }

    const path = parentId === "root" ? `/${name}` : null;

    const folder = await Folder.create({
      name,
      projectId,
      parentId,
      path: path || "/",
      createdBy: userId,
    });

    return res.status(201).json({
      success: true,
      folder,
    });
  } catch (error) {
    console.error("Error creating folder:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating folder",
      error: error.message,
    });
  }
};

export const getContents = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { folderId = "root" } = req.query;

    // Get folders
    const folders = await Folder.find({
      projectId,
      parentId: folderId,
      isDeleted: false,
    }).sort({ name: 1 });

    // Get files
    const files = await File.find({
      projectId,
      folderId,
      isDeleted: false,
    }).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      contents: {
        folders,
        files,
      },
    });
  } catch (error) {
    console.error("Error getting contents:", error);
    return res.status(500).json({
      success: false,
      message: "Error getting contents",
    });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const result = await File.updateOne({ _id: fileId }, { isDeleted: true });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    const file = await File.findById(fileId);
    if (file?.url && file.url.includes("cloudinary")) {
      try {
        const splitUrl = file.url.split("/");
        const publicId = `${splitUrl[splitUrl.length - 2]}/${
          splitUrl[splitUrl.length - 1].split(".")[0]
        }`;
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Cloudinary deletion error:", cloudinaryError);
      }
    }

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting file",
      error: error.message,
    });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const userId = req.id;

    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    await softDeleteFolderContents(folder._id, folder.projectId);

    return res.status(200).json({
      success: true,
      message: "Folder and contents deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting folder",
    });
  }
};

// Helper function to get folder path
const getFolderPath = async (folderId) => {
  const folder = await Folder.findById(folderId);
  return folder ? folder.path : "/root";
};

// Helper function to recursively soft delete folder contents
const softDeleteFolderContents = async (folderId, projectId) => {
  // Mark folder as deleted
  await Folder.findByIdAndUpdate(folderId, { isDeleted: true });

  // Mark all files in folder as deleted
  await File.updateMany({ folderId, projectId }, { isDeleted: true });

  // Find and delete all subfolders recursively
  const subfolders = await Folder.find({ parentId: folderId, projectId });
  for (const subfolder of subfolders) {
    await softDeleteFolderContents(subfolder._id, projectId);
  }
};
