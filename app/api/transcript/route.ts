import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";
import os from "os";

const groq = new Groq({ apiKey: process.env.GROQ_KEY });

export async function POST(request: Request) {
  let tempFilePath = null;

  try {
    console.log("Processing audio transcription request");

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    console.log("Received file:", file?.name);

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create a temporary file (using system temp directory)
    const tempDir = os.tmpdir();
    const timestamp = Date.now();
    const fileExt = path.extname(file.name) || ".mp3"; // Default to mp3 if no extension
    const tempFileName = `temp_audio_${timestamp}${fileExt}`;
    tempFilePath = path.join(tempDir, tempFileName);

    // Write to temporary file
    await writeFile(tempFilePath, buffer);

    console.log("Temp file created at:", tempFilePath);
    console.log("Sending to Groq API for transcription");

    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-large-v3",
      response_format: "verbose_json",
      timestamp_granularities: ["word"],
    });

    console.log("Transcription received");

    return NextResponse.json({ success: true, transcription }, { status: 200 });
  } catch (error) {
    console.error("Error processing transcription:", error);
    return NextResponse.json(
      {
        error: "Failed to process transcription",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    // Clean up: Delete temporary file if it was created
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
        console.log("Temporary file deleted:", tempFilePath);
      } catch (cleanupError) {
        console.error("Error cleaning up temporary file:", cleanupError);
      }
    }
  }
}
