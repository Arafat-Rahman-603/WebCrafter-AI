import express from "express";
import { generateWebsite, getUserWebsites } from "../controller/website.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/generate", verifyToken, generateWebsite);
router.get("/", verifyToken, getUserWebsites);

export default router;
