import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
  addToGroup,
  updateUserStatus,
  getUsersByProfession,
  getAllUsers,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout)
router
  .route("/profile/update")
  .post(isAuthenticated, singleUpload, updateProfile);
router.route("/addToGroup").post(isAuthenticated, addToGroup);

router.route("/status").put(isAuthenticated, updateUserStatus);
router.route("/users/profession/:profession").get(isAuthenticated, getUsersByProfession);
router.route("/users/all").get(isAuthenticated, getAllUsers);


export default router;
