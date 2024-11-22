import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  sendMessage,
  getChannelMessages,
  getGeneralMessages,
  getAnnouncementMessages,
  markMessagesAsRead,
} from "../controllers/message.controller.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated, sendMessage);
router.route("/channel/:id").get(isAuthenticated, getChannelMessages);
router.route("/general").get(isAuthenticated, getGeneralMessages);
router.route("/announcements").get(isAuthenticated, getAnnouncementMessages);
router.route("/markAsRead/:id").post(isAuthenticated, markMessagesAsRead);

export default router;
