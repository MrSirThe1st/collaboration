import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  addDocumentation,
  getDocumentation,
  updateDocumentation,
  deleteDocumentation,
} from "../controllers/documentation.controller.js";

const router = express.Router();

router.post("/add", isAuthenticated, addDocumentation);
router.get("/:projectId", isAuthenticated, getDocumentation);
router.put("/:docId", isAuthenticated, updateDocumentation);
router.delete("/:projectId/:docId", isAuthenticated, deleteDocumentation);

export default router;
