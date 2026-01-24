


import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { connectDb } from "@/lib/connectDb";
import { ObjectId } from "mongodb";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req, context) {
  const params = await context.params; // unwrap if Promise
  const { id } = params;

  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const nameBn = formData.get("nameBn");
    const description = formData.get("description");
    const descriptionBn = formData.get("descriptionBn");
    const mobile = formData.get("mobile");
    const email = formData.get("email");
    const dob = formData.get("dob");
    const dod = formData.get("dod");
    const imageFile = formData.get("image");

    let imageUrl;

    // If new image uploaded, upload to Cloudinary
    if (imageFile && typeof imageFile === "object" && imageFile.name) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResponse = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "authors" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      imageUrl = uploadResponse.secure_url;
    }

    const db = await connectDb();
    const authorsCollection = db.collection("authors");

    const updateDoc = {
      name,
      nameBn,
      description,
      descriptionBn,
      mobile,
      email,
      dob,
      dod,
      ...(imageUrl && { imageUrl }),
    };

    const result = await authorsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ success: false, message: "No changes made" });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // // console.error("Update author error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
