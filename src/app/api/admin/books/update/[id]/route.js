

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";
import { ObjectId } from "mongodb";
import { connectDb } from "@/lib/connectDb";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PATCH(req, { params }) {
  try {
    // const bookId = params.id;
    const bookId = req.nextUrl.pathname.split("/").pop();
    if (!ObjectId.isValid(bookId)) {
      return NextResponse.json({ error: "Invalid book id" }, { status: 400 });
    }

    const formData = await req.formData();



    // Titles & Descriptions
    // const titleEn = formData.get("titleEn") || "";
    const titleEn = formData.get("titleEn");

    // const titleBn = formData.get("titleBn") || "";
    const titleBn = formData.get("titleBn");


    const subtitleEn = formData.get("subtitleEn") || "";
    const subtitleBn = formData.get("subtitleBn") || "";
    const descriptionEn = formData.get("description") || "";
    const descriptionBn = formData.get("descriptionBn") || "";

    // Authors, Translators, Editors
    const authors =
      formData.getAll("authors[]")?.map((a) => JSON.parse(a)) || [];
    const translators =
      formData.getAll("translators[]")?.map((t) => JSON.parse(t)) || [];
    const editors =
      formData.getAll("editors[]")?.map((e) => JSON.parse(e)) || [];

    // Collections
    const collections =
      formData.getAll("collections[]")?.map((c) => JSON.parse(c)) || [];

    // Categories
    const categories =
      formData.getAll("categories[]")?.map((c) => JSON.parse(c)) || [];

    // Other details
    const price = parseFloat(formData.get("price") || 0);
    const discount = parseFloat(formData.get("discount") || 0);
    const discountedPrice = parseFloat(formData.get("discountedPrice") || 0);
    const publisher = formData.get("publisher") || "";

    // Published Date
    let publishedDate = null;
    const rawDate = formData.get("publishedDate");
    if (rawDate) {
      if (rawDate.includes("/")) {
        const [day, month, year] = rawDate.split("/");
        publishedDate = new Date(`${year}-${month}-${day}`);
      } else {
        publishedDate = new Date(rawDate);
      }
    }

    const isbn = formData.get("isbn") || "";
    const language = formData.get("language") || "বাংলা";
    const format = formData.get("format") || "";
    const edition = formData.get("edition") || "";
    const pages = parseInt(formData.get("pages") || 0);
    const orderType = formData.get("orderType") || "";
    const availability = formData.get("availability") || "";

    // Upload cover image (only if a new one provided)
    let cover = null;
    const coverFile = formData.get("coverImage");
    if (coverFile?.size > 0 && coverFile.arrayBuffer) {
      const buffer = Buffer.from(await coverFile.arrayBuffer());
      const filename = `${randomUUID()}-${coverFile.name}`;
      const tmpPath = path.join(os.tmpdir(), filename);
      await writeFile(tmpPath, buffer);

      const result = await cloudinary.uploader.upload(tmpPath, {
        folder: "books/cover",
      });
      cover = { url: result.secure_url, publicId: result.public_id };

      await unlink(tmpPath);
    }
    // Upload pdf  (only if a new one provided)
    let pdf = null;
    const pdfFile = formData.get("bookPdf");
    if (pdfFile?.size > 0 && pdfFile.arrayBuffer) {
      const buffer = Buffer.from(await pdfFile.arrayBuffer());
      const filename = `${randomUUID()}-${pdfFile.name}`;
      const tmpPath = path.join(os.tmpdir(), filename);
      await writeFile(tmpPath, buffer);

      const result = await cloudinary.uploader.upload(tmpPath, {
        folder: "books/pdf",
        resource_type: "raw",          // PDF is a raw file
        // type: "authenticated",         // IMPORTANT: must be "authenticated"
        access_mode: "public"

      });

      pdf = { url: result.secure_url, publicId: result.public_id };

      await unlink(tmpPath);
    }

    // Build update object
    const updateData = {
      // title: {
      //   en: titleEn,
      //   bn: titleBn,
      //   subtitle: { en: subtitleEn, bn: subtitleBn },
      // },
      description: { en: descriptionEn, bn: descriptionBn },
      authors,
      translators,
      editors,
      collections,
      categories,
      price,
      discount,
      discountedPrice,
      publisher,
      publishedDate,
      isbn,
      language,
      format,
      edition,
      pages,
      orderType,
      availability,
    };

    if (titleEn !== null) updateData["title.en"] = titleEn;
    if (titleBn !== null) updateData["title.bn"] = titleBn;

    // Only update cover if a new one was uploaded
    if (cover) {
      updateData.cover = cover;
    }
    if (pdf) {
      updateData.pdf = pdf;
    }

    // Update in MongoDB
    const db = await connectDb();
    const result = await db
      .collection("books")
      .updateOne({ _id: new ObjectId(bookId) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // // console.error("PATCH /books error:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}
