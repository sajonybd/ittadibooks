


import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get("id");

    if (!publicId) {
      return new NextResponse("Missing PDF id", { status: 400 });
    }

    const normalizedId = publicId.replace(/\.pdf$/i, "");

    const candidateUrls = [
      // Public upload URL
      cloudinary.url(publicId, {
        resource_type: "raw",
        type: "upload",
        secure: true,
      }),
      // Signed upload URL
      cloudinary.url(normalizedId, {
        resource_type: "raw",
        type: "upload",
        sign_url: true,
        secure: true,
        format: "pdf",
      }),
      // Signed authenticated URL
      cloudinary.url(normalizedId, {
        resource_type: "raw",
        type: "authenticated",
        sign_url: true,
        secure: true,
        format: "pdf",
      }),
      // Private download fallback (authenticated)
      cloudinary.utils.private_download_url(normalizedId, "pdf", {
        resource_type: "raw",
        type: "authenticated",
      }),
    ];

    let pdfResponse = null;
    for (const candidate of candidateUrls) {
      const res = await fetch(candidate);
      if (res.ok) {
        pdfResponse = res;
        break;
      }
    }

    if (!pdfResponse?.ok) {
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
