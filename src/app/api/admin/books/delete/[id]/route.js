import { connectDb } from "@/lib/connectDb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
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

    const result = await db.collection("books").deleteOne({
      $or: candidates,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // // // console.error("Delete Book Error:", error);
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
