
import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { bookIds } = await request.json();

    if (!bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
      return NextResponse.json({ books: [] });
    }

    const db = await connectDb();
    const booksCollection = db.collection("books");

    const books = await booksCollection
      .find({ bookId: { $in: bookIds } }, { projection: { _id: 0 } })
      .toArray();

    return NextResponse.json({ books });
  } catch (err) {
    // // // console.error("Error in POST /api/cart/getBooks:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
