import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createChannel,
  getProjectChannels,
  deleteChannel,
  postAnnouncement,
  getPinnedMessages,
  sendMessage,
  getChannelMessages,
  deleteMessage
} from "../controllers/channel.controller.js";

const router = express.Router();

// Channel management routes
router.route("/create").post(isAuthenticated, createChannel);
router.route("/get/:projectId").get(isAuthenticated, getProjectChannels);
router.route("/delete/:channelId").delete(isAuthenticated, deleteChannel);

// Message routes
router.route("/message").post(isAuthenticated, sendMessage);
router.route("/messages/:channelId").get(isAuthenticated, getChannelMessages);

// Announcement routes
router.route("/announcement").post(isAuthenticated, postAnnouncement);
router.route("/:channelId/pinned").get(isAuthenticated, getPinnedMessages);
router.route("/message/:messageId").delete(isAuthenticated, deleteMessage);

export default router;
