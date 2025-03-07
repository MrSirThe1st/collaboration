import express from "express";
import { searchProfessions } from "../controllers/profession.controller.js";

const router = express.Router();

router.get("/search", searchProfessions);

export default router;
