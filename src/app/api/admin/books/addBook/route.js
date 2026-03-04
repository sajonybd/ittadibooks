


import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";
import { connectDb } from "@/lib/connectDb";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const bookId = `book${randomUUID()}`;

    // Titles
    const titleEn = formData.get("titleEn") || "";
    const titleBn = formData.get("titleBn") || "";
    const subtitleEn = formData.get("subtitleEn") || "";
    const subtitleBn = formData.get("subtitleBn") || "";

    // Description
    const descriptionEn = formData.get("description") || "";
    const descriptionBn = formData.get("descriptionBn") || "";

    // Authors, translators, editors
    const authors = formData.getAll("authors[]").map((a) => JSON.parse(a));
    const translators = formData.getAll("translators[]").map((t) => JSON.parse(t));
    const editors = formData.getAll("editors[]").map((e) => JSON.parse(e));

    // Collections & Categories
    const collections = formData.getAll("collections[]").map((c) => JSON.parse(c));
    const categories = formData.getAll("categories[]").map((c) => JSON.parse(c));

    // Other book details
    const price = parseFloat(formData.get("price") || 0);
    const discount = parseFloat(formData.get("discount") || 0);
    const discountedPrice = parseFloat(formData.get("discountedPrice") || 0);
    const publisher = formData.get("publisher") || "";

    // Published date
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
    const language = formData.get("language") || "";
    const format = formData.get("format") || "";
    const edition = formData.get("edition") || "";
    const pages = parseInt(formData.get("pages") || 0);
    const orderType = formData.get("orderType") || "";
    const availability = formData.get("availability") || "";

    // Cover upload (required)
    const coverFile = formData.get("coverImage");
    if (!coverFile || !coverFile.arrayBuffer) {
      return NextResponse.json(
        { error: "Cover image is required" },
        { status: 400 }
      );
    }

    let coverUrl = "", coverPublicId = "";
    try {
      const buffer = Buffer.from(await coverFile.arrayBuffer());
      const filename = `${randomUUID()}-${coverFile.name}`;
      const tmpPath = path.join(os.tmpdir(), filename);
      await writeFile(tmpPath, buffer);

      const result = await cloudinary.uploader.upload(tmpPath, {
        folder: "books/cover",
      });

      coverUrl = result.secure_url;
      coverPublicId = result.public_id;
      await unlink(tmpPath);
    } catch (err) {
      console.error("Cover upload failed:", err);
      return NextResponse.json(
        { error: "Failed to upload cover image" + (err.message ? ": " + err.message : "") },
        { status: 500 }
      );
    }

    // PDF upload (optional)
    let pdfUrl = "", pdfPublicId = "";
    let pagesImages = [];
    let pdfSplitWarning = null;
    const pdfFile = formData.get("bookPdf");
    if (pdfFile && pdfFile.arrayBuffer && pdfFile.size > 0) {
      try {
        const buffer = Buffer.from(await pdfFile.arrayBuffer());
        const filename = `${randomUUID()}-${pdfFile.name}`;
        const tmpPath = path.join(os.tmpdir(), filename);
        try {
          await writeFile(tmpPath, buffer);

          const result = await cloudinary.uploader.upload(tmpPath, {
            folder: "books/pdf",
            resource_type: "raw",
            access_mode: "public",
          });

          pdfUrl = result.secure_url;
          pdfPublicId = result.public_id;

          try {
            const previewAsset = await cloudinary.uploader.upload(tmpPath, {
              folder: `books/pages/${bookId}`,
              public_id: "source-pdf",
              overwrite: true,
              resource_type: "image",
              format: "pdf",
            });

            const totalPages = Number(previewAsset?.pages || 0);
            for (let pageNum = 1; pageNum <= totalPages; pageNum += 1) {
              const pageUrl = cloudinary.url(previewAsset.public_id, {
                secure: true,
                resource_type: "image",
                type: "upload",
                format: "jpg",
                version: previewAsset.version,
                page: pageNum,
                sign_url: true,
              });

              pagesImages.push({
                page: pageNum,
                url: pageUrl,
                publicId: `${previewAsset.public_id}:page-${pageNum}`,
              });
            }
          } catch (splitError) {
            pagesImages = [];
            pdfSplitWarning =
              "PDF uploaded, but page JPG generation failed from Cloudinary.";
            console.error("PDF split failed:", splitError);
          }
        } finally {
          await unlink(tmpPath).catch(() => {});
        }
      } catch (err) {
        console.error("PDF upload failed:", err);
        return NextResponse.json(
          { error: "Failed to upload PDF file" + (err.message ? ": " + err.message : "") },
          { status: 500 }
        );
      }
    }

    // totalPages
    const totalPages = pages;

    // Save to DB
    const db = await connectDb();

    const bookData = {
      bookId,
      title: {
        en: titleEn,
        bn: titleBn,
        subtitle: { en: subtitleEn, bn: subtitleBn },
      },
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
      pages: totalPages,
      orderType,
      availability,
      cover: { url: coverUrl, publicId: coverPublicId }, // guaranteed not empty
      ...(pdfUrl && { pdf: { url: pdfUrl, publicId: pdfPublicId } }), // add pdf if uploaded
      pagesImages,
      createdAt: new Date(),
    };

    const res = await db.collection("books").insertOne(bookData);

    return NextResponse.json(
      { success: true, bookId: res.insertedId, warning: pdfSplitWarning },
      { status: 201 }
    );
  } catch (error) {
    // // console.error("Add Book Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
