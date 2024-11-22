
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createChannel,
  getProjectChannels,
  deleteChannel,
  postAnnouncement,
  getPinnedMessages,
  togglePinMessage,
} from "../controllers/channel.controller.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, createChannel);
router.route("/get/:projectId").get(isAuthenticated, getProjectChannels);
router.route("/delete/:channelId").delete(isAuthenticated, deleteChannel);
router
  .route("/:channelId/announcement")
  .post(isAuthenticated, singleUpload, postAnnouncement);
router.route("/:channelId/pinned").get(isAuthenticated, getPinnedMessages);
router
  .route("/messages/:messageId/pin")
  .patch(isAuthenticated, togglePinMessage);

export default router;
