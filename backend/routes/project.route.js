import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminProjects, getAllProjects, getProjectById, postProject, assignMemberToProject } from "../controllers/project.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postProject);
router.route("/get").get(isAuthenticated, getAllProjects);
router.route("/getadminprojects").get(isAuthenticated, getAdminProjects);
router.route("/get/:id").get(isAuthenticated, getProjectById);
router.route("/assign-member").post( assignMemberToProject)

export default router;
