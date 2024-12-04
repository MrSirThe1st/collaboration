// projectMessage.route.js
import express from "express";
import {
  sendAnnouncement,
  getAnnouncements,
} from "../controllers/projectMessage.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/announcement/:projectId", isAuthenticated, sendAnnouncement);
router.get("/announcements/:projectId", isAuthenticated, getAnnouncements);

export default router;
