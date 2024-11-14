// routes/channel.route.js
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createChannel,
  getProjectChannels,
  deleteChannel,
} from "../controllers/channel.controller.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, createChannel); 
router.route("/get/:projectId").get(isAuthenticated, getProjectChannels); 
router.route("/delete/:channelId").delete(isAuthenticated, deleteChannel); 

export default router;
