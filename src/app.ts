import express from "express";
import mongoose from "mongoose";
import videoRoutes from "./routes/videoRoutes";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.use(express.json());
app.use("/api/videos", videoRoutes);
app.use("/videos", express.static(path.join(__dirname, "../videos")));

export default app;
