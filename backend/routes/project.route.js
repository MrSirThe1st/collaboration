import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getAdminProjects,
  getAllProjects,
  getProjectById,
  postProject,
  assignMemberToProject,
  getUserById,
  deleteProject
} from "../controllers/project.controller.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/post").post(isAuthenticated,singleUpload, postProject);
router.route("/get").get(isAuthenticated, getAllProjects);
router.route("/getadminprojects").get(isAuthenticated, getAdminProjects);
router.route("/get/:id").get(isAuthenticated, getProjectById);
router.route("/assign-member").post(assignMemberToProject);
router.route("/users/:id").get(isAuthenticated, getUserById);
router.route("/delete/:id").delete(isAuthenticated, deleteProject);

export default router;
