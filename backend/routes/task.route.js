import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  assignTask,
  editTask
} from "../controllers/task.controller.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, createTask);
router.route("/project/:projectId").get(isAuthenticated, getTasks);
router.route("/:id").get(isAuthenticated, getTaskById);
router.route("/update/:id").put(isAuthenticated, updateTask);
router.route("/delete/:id").delete(isAuthenticated, deleteTask);
router.route("/status/:id").patch(isAuthenticated, updateTaskStatus);
router.route("/assign/:id").post(isAuthenticated, assignTask);
router.route("/edit/:id").put(isAuthenticated, editTask);

export default router;
