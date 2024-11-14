import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createMilestone,
  getMilestones,
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
  addTaskToMilestone,
  removeTaskFromMilestone,
} from "../controllers/milestone.controller.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, createMilestone);
router.route("/project/:projectId").get(isAuthenticated, getMilestones);
router.route("/:id").get(isAuthenticated, getMilestoneById);
router.route("/update/:id").put(isAuthenticated, updateMilestone);
router.route("/delete/:id").delete(isAuthenticated, deleteMilestone);
router.route("/:id/tasks/add").post(isAuthenticated, addTaskToMilestone);
router
  .route("/:id/tasks/remove")
  .post(isAuthenticated, removeTaskFromMilestone);

export default router;
