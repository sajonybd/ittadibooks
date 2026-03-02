
import { connectDb } from "@/lib/connectDb";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    let { bookIds } = body;

    // Fallback: if no bookIds passed, load from logged-in user's cart document.
    if (!Array.isArray(bookIds) || bookIds.length === 0) {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (token?.email) {
        const db = await connectDb();
        const cart = await db
          .collection("cart")
          .findOne({ userEmail: token.email }, { projection: { bookIds: 1 } });
        bookIds = cart?.bookIds || [];
      }
    }

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
