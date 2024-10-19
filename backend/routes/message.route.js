import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";


const router = express.Router();


router.route("/:id").get(isAuthenticated, getMessages);
router.route("/send/:id").post(isAuthenticated, sendMessage);

export default router;
