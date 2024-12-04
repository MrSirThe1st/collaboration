import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
import {
  uploadFile,
  createFolder,
  getContents,
  deleteFile,
  deleteFolder,
} from "../controllers/file.controller.js";

const router = express.Router();

router.post("/upload", isAuthenticated, singleUpload, uploadFile);
router.delete("/:fileId", isAuthenticated, deleteFile);
router.post("/folder", isAuthenticated, createFolder);
router.delete("/folder/:folderId", isAuthenticated, deleteFolder);
router.get("/project/:projectId", isAuthenticated, getContents);

export default router;
