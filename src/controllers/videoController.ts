import { Request, Response } from "express";
import Video from "../models/videoModel";
import { convertToHLS } from "../utils/ffmpegUtils";
import path from "path";
import fs from "fs/promises";

export const uploadVideo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { file } = req;

    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const video = new Video({
      originalName: file.originalname,
      fileName: file.filename,
      format: file.mimetype,
      path: file.path,
      size: file.size,
    });

    await video.save();

    const outputDir = path.join(
      process.env.VIDEO_FOLDER || "./videos",
      video.fileName
    );

    await fs.mkdir(outputDir, { recursive: true });

    await convertToHLS(file.path, outputDir);

    const hlsPath = path.join(outputDir, "output.m3u8");
    const hlsChunks = await fs.readdir(outputDir);

    const chunkPaths = hlsChunks
      .filter((chunk) => chunk.endsWith(".ts"))
      .map((chunk) => path.join(outputDir, chunk));

    await Video.findByIdAndUpdate(video._id, {
      hlsPath,
      hlsChunks: chunkPaths,
    });

    res.status(200).json({ message: "Video uploaded and processed", video });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ message: "Error uploading video", error });
  }
};

export const getVideos = async (req: Request, res: Response) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    res.status(500).json({
      message: "Failed to fetch videos",
      error,
    });
  }
};
