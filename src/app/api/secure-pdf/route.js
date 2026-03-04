


import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { connectDb } from "@/lib/connectDb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    const srcParam = searchParams.get("src");

    if (!idParam) {
      return new NextResponse("Missing PDF id", { status: 400 });
    }

    const candidateUrls = [];

    if (srcParam && /^https?:\/\//i.test(srcParam)) {
      candidateUrls.push(srcParam);
    }

    // If caller passes a full URL, proxy that directly.
    if (/^https?:\/\//i.test(idParam)) {
      const direct = await fetch(idParam, { cache: "no-store" });
      if (direct.ok) {
        return new NextResponse(direct.body, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "inline; filename=secure.pdf",
            "Cache-Control": "no-store",
          },
        });
      }
    }

    const publicId = idParam.trim();
    const normalizedId = publicId.replace(/\.pdf$/i, "");

    // DB fallback: resolve stored secure URL by publicId.
    try {
      const db = await connectDb();
      const fromDb = await db.collection("books").findOne(
        {
          $or: [
            { "pdf.publicId": publicId },
            { "pdf.publicId": normalizedId },
            { "pdf.publicId": `${normalizedId}.pdf` },
          ],
        },
        { projection: { "pdf.url": 1 } }
      );

      const dbPdfUrl = fromDb?.pdf?.url;
      if (dbPdfUrl && /^https?:\/\//i.test(dbPdfUrl)) {
        candidateUrls.push(dbPdfUrl);
      }
    } catch (dbErr) {
      console.error("secure-pdf db fallback failed:", dbErr);
    }

    // Raw uploads frequently require explicit .pdf in delivery path.
    const explicitPdfId = `${normalizedId}.pdf`;
    candidateUrls.push(
      // Public upload URL
      cloudinary.url(publicId, {
        resource_type: "raw",
        type: "upload",
        secure: true,
      }),
      // Public upload URL with explicit extension
      cloudinary.url(explicitPdfId, {
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
    );

    let pdfResponse = null;
    for (const candidate of candidateUrls) {
      const res = await fetch(candidate, { cache: "no-store" });
      if (res.ok) {
        pdfResponse = res;
        break;
      }
    }

    if (!pdfResponse?.ok) {
      return new NextResponse("PDF not found or inaccessible", { status: 404 });
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
