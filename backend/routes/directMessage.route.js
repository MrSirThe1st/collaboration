import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  sendDirectMessage,
  getConversation,
  getConversationList,
  markDirectMessageAsRead,
  deleteDirectMessage,
  editDirectMessage,
  editMessage,
  deleteConversation,
} from "../controllers/directMessage.controller.js";

const router = express.Router();

// Direct message routes
router.post("/send", isAuthenticated, sendDirectMessage);
router.get("/conversation/:userId", isAuthenticated, getConversation);
router.get("/conversations", isAuthenticated, getConversationList);
router.post("/read/:messageId", isAuthenticated, markDirectMessageAsRead);
router.delete("/:messageId", isAuthenticated, deleteDirectMessage);
router.put("/:messageId", isAuthenticated, editDirectMessage);
router.delete(
  "/conversation/:conversationId",
  isAuthenticated,
  deleteConversation
);
router.put("/message/:messageId", isAuthenticated, editMessage);

export default router;
