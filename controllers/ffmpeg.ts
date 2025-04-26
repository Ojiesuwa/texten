"use client";

import { toast } from "react-toastify";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

// Create a singleton FFmpeg instance to be reused
let ffmpegInstance: any = null;

// Function to get or create the FFmpeg instance
const getFFmpeg = async () => {
  if (!ffmpegInstance) {
    ffmpegInstance = createFFmpeg({
      log: true,
      corePath: "/ffmpeg/ffmpeg-core.js",
    });
  }

  if (!ffmpegInstance.isLoaded()) {
    console.log("Loading FFmpeg...");
    await ffmpegInstance.load();
    console.log("FFmpeg loaded successfully");
  }

  return ffmpegInstance;
};

export const extractAudioAsMp3FromVideo = async (
  videoBlob: File
): Promise<Blob & { name: string }> => {
  try {
    console.log("Starting audio extraction...");

    // Get FFmpeg instance
    const ffmpeg = await getFFmpeg();

    // Create a safe filename - replace spaces with underscores
    const safeFileName = videoBlob.name.replace(/\s+/g, "_");

    console.log(`Writing file "${safeFileName}" to FFmpeg filesystem`);
    ffmpeg.FS("writeFile", safeFileName, await fetchFile(videoBlob));

    console.log("Running FFmpeg command to extract audio");
    await ffmpeg.run(
      "-i",
      safeFileName,
      "-vn",
      "-acodec",
      "libmp3lame",
      "-q:a",
      "2", // Medium quality (0-9, lower is better)
      "output.mp3"
    );

    console.log("Reading output file");
    const data = ffmpeg.FS("readFile", "output.mp3");

    // Create a new Blob and manually assign a name
    const audioBlob = new Blob([data.buffer], { type: "audio/mp3" });
    const audioFile = Object.assign(audioBlob, { name: "output.mp3" });

    // Cleanup after processing
    try {
      ffmpeg.FS("unlink", safeFileName);
      ffmpeg.FS("unlink", "output.mp3");
    } catch (e) {
      console.warn("Cleanup failed", e);
    }

    return audioFile;
  } catch (error) {
    console.error("Audio extraction error:", error);
    toast.error("Error extracting audio");
    throw new Error("Failed to extract audio");
  }
};

export async function burnAndDownloadWithSubtitles(
  videoBlob: Blob,
  assContent: string,
  filename: string = "subtitled-video.mp4"
): Promise<void> {
  try {
    console.log("Starting subtitle burning process...");

    // Get FFmpeg instance
    const ffmpeg = await getFFmpeg();

    // 1. Write files to FFmpeg's virtual filesystem
    console.log("Writing input files to FFmpeg filesystem");
    await ffmpeg.FS("writeFile", "input.mp4", await fetchFile(videoBlob));
    await ffmpeg.FS(
      "writeFile",
      "subtitles.ass",
      new TextEncoder().encode(assContent)
    );

    console.log("Running FFmpeg command to burn subtitles");
    // 2. Run FFmpeg command with more robust options
    await ffmpeg.run(
      "-i",
      "input.mp4",
      "-vf",
      "subtitles=subtitles.ass:force_style='Fontsize=24,PrimaryColour=&HFFFFFF&,Outline=1,Shadow=1'",
      "-c:v",
      "libx264", // Force H.264 encoding
      "-crf",
      "23", // Quality setting
      "-preset",
      "fast",
      "-c:a",
      "aac", // Use AAC audio for better compatibility
      "-b:a",
      "128k", // Audio bitrate
      "-y", // Overwrite output
      "output.mp4"
    );

    // 3. Verify output exists
    try {
      await ffmpeg.FS("readFile", "output.mp4");
      console.log("Output file created successfully");
    } catch (e) {
      throw new Error("FFmpeg failed to create output file");
    }

    // 4. Create and download the blob
    const data = ffmpeg.FS("readFile", "output.mp4");
    const outBlob = new Blob([data.buffer], { type: "video/mp4" });

    console.log("Initiating download...");
    const url = URL.createObjectURL(outBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      try {
        ffmpeg.FS("unlink", "input.mp4");
        ffmpeg.FS("unlink", "subtitles.ass");
        ffmpeg.FS("unlink", "output.mp4");
      } catch (e) {
        console.warn("Cleanup failed", e);
      }
    }, 100);

    console.log("Process completed successfully");
  } catch (error: any) {
    console.error("Error during subtitle burning:", error);

    // Additional error handling for subtitle issues
    if (error.message?.includes("ass") || error.message?.includes("subtitle")) {
      console.error("Subtitle format error. Verify your ASS file content:");
      console.log(assContent);
    }
    toast.error("Failed to process video with subtitles");
    throw error;
  }
}
