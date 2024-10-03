import path from "path";
import fs from "fs";
import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";

export const convertToHLS = (
  inputPath: string,
  outputDir: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!ffmpegPath) {
      reject(new Error("ffmpeg not found"));
      return;
    }

    console.log("Input Path:", inputPath);

    if (!fs.existsSync(inputPath)) {
      reject(new Error(`Input file does not exist: ${inputPath}`));
      return;
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`Output directory created: ${outputDir}`);
    } else {
      console.log(`Output directory exists: ${outputDir}`);
    }

    const outputPath = path.join(outputDir, "output.m3u8");

    console.log("Output Path:", outputPath);

    ffmpeg(inputPath)
      .setFfmpegPath(ffmpegPath)
      .outputOptions([
        "-codec: copy",
        "-start_number 0",
        "-hls_time 10",
        "-hls_list_size 0",
        "-f hls",
        "-hls_flags delete_segments",
      ])
      .output(outputPath)
      .on("end", () => {
        console.log("HLS conversion completed successfully.");
        resolve();
      })
      .on("error", (err: any) => {
        console.error("Error during HLS conversion:", err);
        reject(err);
      })
      .run();
  });
};
