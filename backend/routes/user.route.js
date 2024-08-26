import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
  addToGroup,
  updateUserStatus,
  getUsersByProfession
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router
  .route("/profile/update")
  .post(isAuthenticated, singleUpload, updateProfile);
  router.route("/addToGroup").post(addToGroup);
router.route("/status").put(isAuthenticated, updateUserStatus);
router.route("/users/profession/:profession").get( getUsersByProfession);

export default router;