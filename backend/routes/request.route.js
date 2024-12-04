import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  sendRequest,
  getRequesters,
  getRequestsSent,
  updateStatus,
  deleteRequest
} from "../controllers/request.controller.js";

const router = express.Router();

router.route("/request/:id").post(isAuthenticated, sendRequest);
router.route("/get").get(isAuthenticated, getRequestsSent);
router.route("/:id/requesters").get(isAuthenticated, getRequesters);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
router.route("/request/:id").delete(isAuthenticated, deleteRequest);

export default router;
