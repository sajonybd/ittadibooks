


import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { writeFile } from "fs/promises";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";
import { connectDb } from "@/lib/connectDb";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
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

    let imageUrl = "";
    let imagePublicId = "";

    // Upload to Cloudinary if image exists
    if (imageFile && typeof imageFile === "object" && "arrayBuffer" in imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const filename = `${randomUUID()}-${imageFile.name}`;
      const tmpDir = os.tmpdir();
      const tmpFilePath = path.join(tmpDir, filename);
      await writeFile(tmpFilePath, buffer);

      const result = await cloudinary.uploader.upload(tmpFilePath, {
        folder: "authors",
      });

      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const db = await connectDb();
    const collection = db.collection("authors");

    const newAuthor = {
      uid: randomUUID(),
      name,
      nameBn,
      description,
      descriptionBn,
      mobile,
      email,
      dob, // date of birth
      dod, // date of death
      imageUrl,
      imagePublicId,
      createdAt: new Date(),
    };

    const insertResult = await collection.insertOne(newAuthor);

    return NextResponse.json(
      { success: true, id: insertResult.insertedId },
      { status: 201 }
    );
  } catch (error) {
    // // console.error("Add Author Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
