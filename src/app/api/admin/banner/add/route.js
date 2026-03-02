import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const file = formData.get("image"); // 'image' is the FormData field name

    if (!file || typeof file === "string") {
      return NextResponse.json({ success: false, message: "No image uploaded" }, { status: 400 });
    }

    // Convert blob to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

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
