import { NextResponse } from "next/server";
 
import { connectDb } from "@/lib/connectDb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const db = await connectDb();
    const resolvedParams =
      params && typeof params.then === "function" ? await params : params;

    const pathSegments = req.nextUrl.pathname.split("/").filter(Boolean);
    const fallbackId = pathSegments[pathSegments.length - 1];
    const rawId = (resolvedParams?.id || fallbackId || "").trim();

    if (!rawId) {
      return NextResponse.json({ error: "Book id is required" }, { status: 400 });
    }

    const candidates = [{ bookId: rawId }, { _id: rawId }];
    if (ObjectId.isValid(rawId)) {
      candidates.unshift({ _id: new ObjectId(rawId) });
    }

    const book = await db.collection("books").findOne({ $or: candidates });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, book });
  } catch (error) {
    // // // console.error(error);
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 });
  }
}
