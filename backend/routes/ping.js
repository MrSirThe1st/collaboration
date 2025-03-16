import express from "express";
const router = express.Router();

router.get("/ping", (req, res) => {
  console.log("Ping received from:", req.headers.origin);
  res.status(200).json({ message: "pong", success: true });
});

export default router;
