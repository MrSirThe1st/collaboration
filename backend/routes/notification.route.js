import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications
} from "../controllers/notification.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/", isAuthenticated, getNotifications);
router.patch("/:notificationId/read", isAuthenticated, markAsRead);
router.patch("/mark-all-read", isAuthenticated, markAllAsRead);
router.delete("/clear-all", isAuthenticated, clearAllNotifications);
router.delete("/:notificationId", isAuthenticated, deleteNotification);


export default router;
