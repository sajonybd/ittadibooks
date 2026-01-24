 


import { connectDb } from "@/lib/connectDb";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectDb();
    const wishlistCollection = db.collection("wishlist");
    const booksCollection = db.collection("books");

    // Get wishlist for the current user
    const wishlist = await wishlistCollection.findOne({ userEmail: token.email });

    if (!wishlist || !wishlist.bookIds || wishlist.bookIds.length === 0) {
      return NextResponse.json({ books: [] });
    }

    // Fetch books by bookId instead of _id
    const books = await booksCollection
      .find({ bookId: { $in: wishlist.bookIds } })
      .toArray();

    return NextResponse.json({ books });
  } catch (error) {
    // // // console.error("Wishlist fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
