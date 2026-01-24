import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";

export async function GET(req) {
  try {
    const db = await connectDb();

    // get bookId from query parameter
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return NextResponse.json(
        { success: false, message: "Missing bookId parameter" },
        { status: 400 }
      );
    }

    const reviews = await db
      .collection("reviews")
      .find({ bookId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
