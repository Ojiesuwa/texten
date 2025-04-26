import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import Groq from "groq-sdk";
import fs from "fs";
import { Readable } from "stream";

// Get your groq api key
// PS: The Groq Javascript module works only when you read stream from file saved on the disk
// Vercel has an issue with this
// There's a hack to it but I've lost motivation for this project
// Goodluck Sirs and Ma's
// Have fun!

const groq = new Groq({ apiKey: process.env.GROQ_KEY });

export async function POST(request: Request) {
  try {
    console.log("LALA");

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    console.log(file?.name);

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer);

    // Create a unique filename
    const timestamp = Date.now();
    const ext = path.extname(file.name);
    const filename = `${timestamp}.mp3`;

    console.log("Reached here");

    // Save to public/uploads directory
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    await writeFile(path.join(uploadDir, filename), buffer);

    const filePath = path.join(process.cwd(), "public", "uploads", filename);

    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-large-v3",
      response_format: "verbose_json",
      timestamp_granularities: ["word"],
    });
    console.log(transcription);

    return NextResponse.json(
      { success: true, filename, transcription },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
