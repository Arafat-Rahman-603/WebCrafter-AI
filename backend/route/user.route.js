import express from "express";
import multer from "multer";
import { updateProfile, uploadAvatar } from "../controller/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.put("/update", verifyToken, updateProfile);
router.post("/upload-avatar", verifyToken, upload.single("avatar"), uploadAvatar);

export default router;
