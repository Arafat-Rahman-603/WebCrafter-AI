import express from "express";
import {
  generateWebsite,
  getUserWebsites,
  getWebsiteById,
  getWebsiteBySlug,
  fixWebsite,
  updateWebsiteCode,
  deployWebsite,
  updateTitle,
  updateThumbnail,
  deleteWebsite,
} from "../controller/website.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Public — no auth required
router.get("/public/:slug", getWebsiteBySlug);

// Protected routes
router.post("/generate", verifyToken, generateWebsite);
router.get("/", verifyToken, getUserWebsites);
router.get("/:id", verifyToken, getWebsiteById);
router.post("/:id/fix", verifyToken, fixWebsite);
router.patch("/:id/code", verifyToken, updateWebsiteCode);
router.post("/:id/deploy", verifyToken, deployWebsite);
router.patch("/:id/title", verifyToken, updateTitle);
router.patch("/:id/thumbnail", verifyToken, updateThumbnail);
router.delete("/:id", verifyToken, deleteWebsite);

export default router;
