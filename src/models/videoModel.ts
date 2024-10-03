import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  fileName: { type: String, required: true },
  format: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
  hlsPath: { type: String },
  hlsChunks: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
