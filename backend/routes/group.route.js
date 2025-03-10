import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getGroup,
  getGroupById,
  updateGroup,
  createGroup,
  addMemberToGroup,
  deleteGroup
} from "../controllers/group.controller.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(isAuthenticated,singleUpload, createGroup);
router.route("/get").get(isAuthenticated, getGroup);
router.route("/get/:id").get(isAuthenticated, getGroupById);
router.route("/update/:id").put(isAuthenticated, singleUpload, updateGroup);
router.route("/addMember/:groupId").post(isAuthenticated, addMemberToGroup);
router.route("/delete/:id").delete(isAuthenticated, deleteGroup);

export default router;
