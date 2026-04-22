import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./route/auth.route.js";
import userRoutes from "./route/user.route.js";
import websiteRoutes from "./route/website.route.js";

dotenv.config();

const app = express();

// Allow both local dev and production frontend
const allowedOrigins = [
  "http://localhost:3000",
  "https://webcrafter-ai.vercel.app",
  "https://webcrafter-ai-server.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
  }),
);

app.use(cookieParser());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "WebCrafter AI server is running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/website", websiteRoutes);

export default app;

