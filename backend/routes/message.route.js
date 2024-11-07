import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {  sendMessage } from "../controllers/message.controller.js";


const router = express.Router();



router.route("/send/:id").post(isAuthenticated, sendMessage);

export default router;
