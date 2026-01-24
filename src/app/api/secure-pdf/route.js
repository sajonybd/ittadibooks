


import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get("id");

    if (!publicId) {
      return new NextResponse("Missing PDF id", { status: 400 });
    }

    // ✅ CORRECT: generate signed authenticated URL
    const signedUrl = cloudinary.v2.utils.private_download_url(
      publicId,
      "pdf",
      {
        resource_type: "raw",
      }
    );

    const pdfResponse = await fetch(signedUrl);

    if (!pdfResponse.ok) {
      console.error("Cloudinary fetch failed");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return new NextResponse(pdfResponse.body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=secure.pdf",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("Server error", { status: 500 });
  }
}
