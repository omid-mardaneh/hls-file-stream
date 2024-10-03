import express from "express";
import multer from "multer";
import { uploadVideo, getVideos } from "../controllers/videoController";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("video"), uploadVideo);

router.get("/", getVideos);

export default router;
