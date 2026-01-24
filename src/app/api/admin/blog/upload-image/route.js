import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file || !file.arrayBuffer) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Save temporarily
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${randomUUID()}-${file.name}`;
    const tmpPath = path.join(os.tmpdir(), filename);
    await writeFile(tmpPath, buffer);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(tmpPath, {
      folder: "blogs/images",
    });

    await unlink(tmpPath);

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    // // console.error("Upload Image Error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
