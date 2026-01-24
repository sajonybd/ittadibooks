import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: { bodyParser: false }, // not strictly needed in app router, safe to keep
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const caption = formData.get("caption") || "";
    const files = formData.getAll("images"); // get all images

    if (!files || files.length === 0)
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });

    const uploadedImages = [];

    for (const file of files) {
      // Convert Blob/File to buffer for Cloudinary upload
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await cloudinary.v2.uploader.upload_stream(
        { folder: "book-gallery" },
        (error, result) => {
          if (error) throw error;
          return result;
        }
      );

      // Use upload_stream with a Promise wrapper
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { folder: "book-gallery" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      uploadedImages.push({
        src: uploadResult.secure_url,
        caption,
        uploadedAt: new Date(),
      });
    }

    // Save to MongoDB
    const db = await connectDb();
    await db.collection("galleryImages").insertMany(uploadedImages);

    return NextResponse.json({ images: uploadedImages });
  } catch (err) {
    // // console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// Optional: GET and DELETE can remain the same as before
