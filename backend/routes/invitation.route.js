import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createInvitation,
  getReceivedInvitations,
  updateInvitationStatus,
  getSentInvitations,
} from "../controllers/invitation.controller.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, createInvitation);
router.route("/received").get(isAuthenticated, getReceivedInvitations);
router.route("/:id/status").post(isAuthenticated, updateInvitationStatus);
router.route("/get").get(isAuthenticated, getSentInvitations);

export default router;
