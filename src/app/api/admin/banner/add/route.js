import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const file = formData.get("image"); // 'image' is the FormData field name

    if (!file || typeof file === "string") {
      return NextResponse.json({ success: false, message: "No image uploaded" }, { status: 400 });
    }

    // Convert blob to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "slider-banners" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    const db = await connectDb();
    const bannerCollection = db.collection("banners");

    const doc = {
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      uploadedAt: new Date(),
    };

    await bannerCollection.insertOne(doc);

    return NextResponse.json({ success: true, banner: doc });
  } catch (error) {
    // // // console.error("Banner Upload Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
