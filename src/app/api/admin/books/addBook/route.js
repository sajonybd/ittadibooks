


import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { createWriteStream } from "fs";
import { unlink, writeFile } from "fs/promises";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";
import { connectDb } from "@/lib/connectDb";
import { pipeline } from "stream/promises";
import { Readable } from "stream";

export const runtime = "nodejs";
export const maxDuration = 300;

const MAX_COVER_BYTES = 15 * 1024 * 1024; // 15MB
const MAX_PDF_BYTES = 200 * 1024 * 1024; // 200MB

async function writeFormFileToTmp(file) {
  const safeName = typeof file?.name === "string" && file.name ? file.name : "upload";
  const tmpPath = path.join(os.tmpdir(), `${randomUUID()}-${safeName}`);

  // Prefer streaming to avoid loading large uploads into memory.
  if (file?.stream) {
    await pipeline(Readable.fromWeb(file.stream()), createWriteStream(tmpPath));
    return tmpPath;
  }

  // Fallback for runtimes where File.stream() isn't available.
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(tmpPath, buffer);
  return tmpPath;
}

export async function POST(req) {
  try {
    let formData;
    try {
      formData = await req.formData();
    } catch (err) {
      const msg = err?.message || "";
      // When Next/platform rejects large multipart bodies, surface a helpful 413 instead of crashing the UI.
      if (
        msg.includes("Body exceeded") ||
        msg.toLowerCase().includes("entity.too.large") ||
        msg.toLowerCase().includes("payload too large")
      ) {
        return NextResponse.json(
          {
            error:
              "Upload is too large for the server. Please upload a smaller file or increase the server/proxy body size limit.",
          },
          { status: 413 }
        );
      }

      console.error("Invalid multipart/form-data:", err);
      return NextResponse.json(
        { error: "Invalid upload form data" },
        { status: 400 }
      );
    }
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

    // Cover (required) - either direct URL+publicId, or an uploaded file
    let coverUrl = "", coverPublicId = "";
    const coverUrlFromForm = formData.get("coverUrl");
    const coverPublicIdFromForm = formData.get("coverPublicId");
    if (typeof coverUrlFromForm === "string" && typeof coverPublicIdFromForm === "string" && coverUrlFromForm && coverPublicIdFromForm) {
      coverUrl = coverUrlFromForm;
      coverPublicId = coverPublicIdFromForm;
    } else {
      const coverFile = formData.get("coverImage");
      if (!coverFile || !coverFile.arrayBuffer) {
        return NextResponse.json(
          { error: "Cover image is required" },
          { status: 400 }
        );
      }
      if (
        typeof coverFile.size === "number" &&
        coverFile.size > MAX_COVER_BYTES
      ) {
        return NextResponse.json(
          { error: "Cover image is too large (max 15MB)." },
          { status: 413 }
        );
      }

      let coverTmpPath = null;
      try {
        coverTmpPath = await writeFormFileToTmp(coverFile);
        const result = await cloudinary.uploader.upload(coverTmpPath, {
          folder: "books/cover",
        });

        coverUrl = result.secure_url;
        coverPublicId = result.public_id;
      } catch (err) {
        console.error("Cover upload failed:", err);
        return NextResponse.json(
          {
            error:
              "Failed to upload cover image" +
              (err.message ? ": " + err.message : ""),
          },
          { status: 500 }
        );
      } finally {
        if (coverTmpPath) await unlink(coverTmpPath).catch(() => {});
      }
    }

    // PDF upload (optional)
    let pdfUrl = "", pdfPublicId = "";
    let pagesImages = [];
    let pdfSplitWarning = null;
    const pdfUrlFromForm = formData.get("pdfUrl");
    const pdfPublicIdFromForm = formData.get("pdfPublicId");
    const pdfFile = formData.get("bookPdf");

    const shouldUseUploadedPdfUrl =
      typeof pdfUrlFromForm === "string" &&
      typeof pdfPublicIdFromForm === "string" &&
      pdfUrlFromForm &&
      pdfPublicIdFromForm;

    if (shouldUseUploadedPdfUrl) {
      pdfUrl = pdfUrlFromForm;
      pdfPublicId = pdfPublicIdFromForm;
    } else if (pdfFile && pdfFile.arrayBuffer && pdfFile.size > 0) {
      if (typeof pdfFile.size === "number" && pdfFile.size > MAX_PDF_BYTES) {
        return NextResponse.json(
          { error: "PDF is too large (max 200MB)." },
          { status: 413 }
        );
      }

      let pdfTmpPath = null;
      try {
        try {
          pdfTmpPath = await writeFormFileToTmp(pdfFile);

          const result = await cloudinary.uploader.upload(pdfTmpPath, {
            folder: "books/pdf",
            resource_type: "raw",
            access_mode: "public",
          });

          pdfUrl = result.secure_url;
          pdfPublicId = result.public_id;
        } finally {
          if (pdfTmpPath) await unlink(pdfTmpPath).catch(() => {});
        }
      } catch (err) {
        console.error("PDF upload failed:", err);
        return NextResponse.json(
          {
            error:
              "Failed to upload PDF file" + (err.message ? ": " + err.message : ""),
          },
          { status: 500 }
        );
      }
    }

    // Generate page JPGs (optional) if we have a PDF URL now.
    if (pdfUrl) {
      try {
        const previewAsset = await cloudinary.uploader.upload(pdfUrl, {
          folder: `books/pages/${bookId}`,
          public_id: "source-pdf",
          overwrite: true,
          resource_type: "image",
          format: "pdf",
        });

        const totalPagesFromPdf = Number(previewAsset?.pages || 0);
        for (let pageNum = 1; pageNum <= totalPagesFromPdf; pageNum += 1) {
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
    console.error("Add Book Error:", error);
    return NextResponse.json(
      { error: "Server error" + (error?.message ? ": " + error.message : "") },
      { status: 500 }
    );
  }
}
