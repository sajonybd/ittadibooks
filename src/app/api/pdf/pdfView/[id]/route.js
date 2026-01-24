// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";
// import cloudinary from "@/lib/cloudinary";
// import { connectDb } from "@/lib/connectDb";
// import { ObjectId } from "mongodb";

// export async function GET(req, { params }) {

//     console.log("Received request for PDF with params:", params);
//   // 🔐 Auth check
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   const db = await connectDb();

//   console.log("Fetching PDF for book ID:", params.id);

//   // 📘 Find book (native MongoDB)
//   const book = await db
//     .collection("books")
//     .findOne({ _id: new ObjectId(params.id) });

// //   if (!book || !book.pdfPublicId) {
// //     return NextResponse.json({ message: "PDF not found" }, { status: 404 });
// //   }

//   const pdfPublicId="1755765424515-s4s.pdf_phcz0z";

//   // 🔑 Signed Cloudinary URL (5 minutes)
//   const signedUrl = cloudinary.url(pdfPublicId, {
//     resource_type: "raw",
//     type: "authenticated",
//     sign_url: true,
//     expires_at: Math.floor(Date.now() / 1000) + 60 * 5,
//   });

//   // ⚡ Stream PDF
//   const cloudRes = await fetch(signedUrl);
  
// //   if (!cloudRes.ok) {
// //     return NextResponse.json(
// //       { message: "Failed to fetch PDF" },
// //       { status: 500 }
// //     );
// //   }
// // console.log("Successfully fetched PDF from Cloudinary", cloudRes);
//   const buffer = await cloudRes.arrayBuffer();

//   return new NextResponse(buffer, {
//     headers: {
//       "Content-Type": "application/pdf",
//       "Content-Disposition": "inline",
//       "Cache-Control": "no-store",
//     },
//   });
// }



import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { v2 as cloudinary } from "cloudinary";
import { connectDb } from "@/lib/connectDb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const db = await connectDb();
  const book = await db.collection("books").findOne({ _id: new ObjectId(params.id) });

  if (!book || !book.pdfPublicId) {
    return NextResponse.json({ message: "PDF not found" }, { status: 404 });
  }

  // 🔑 Generate signed Cloudinary URL (5 minutes)
  const signedUrl = cloudinary.url(book.pdfPublicId, {
    resource_type: "raw",
    type: "authenticated",
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 5,
  });

  // ⚡ Stream PDF from Cloudinary
  const cloudRes = await fetch(signedUrl);
  if (!cloudRes.ok) {
    return NextResponse.json({ message: "Failed to fetch PDF" }, { status: 500 });
  }

  const buffer = await cloudRes.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
      "Cache-Control": "no-store",
    },
  });
}
