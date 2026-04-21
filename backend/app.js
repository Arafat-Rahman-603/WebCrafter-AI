import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./route/auth.route.js";
import userRoutes from "./route/user.route.js";
import websiteRoutes from "./route/website.route.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "https://webcrafter-ai.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());
app.use(express.json());



app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/website", websiteRoutes);

export default app;
