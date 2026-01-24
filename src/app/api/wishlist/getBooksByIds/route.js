 

import { connectDb } from "@/lib/connectDb";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookIds } = await request.json();

    if (!bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
      return NextResponse.json({ books: [], wishlistId: null });
    }

    const db = await connectDb();
    const booksCollection = db.collection("books");
    const wishlistCollection = db.collection("wishlist");

    // 1. Upsert wishlist and add all given bookIds (no duplicates)
    const updateResult = await wishlistCollection.updateOne(
      { userEmail: token.email },
      { $addToSet: { bookIds: { $each: bookIds } } }, // $each allows multiple IDs
      { upsert: true }
    );

    // 2. Get the updated wishlist document
    const wishlistDoc = await wishlistCollection.findOne({
      userEmail: token.email,
    });

    // 3. Fetch the actual book details for those IDs
    const books = await booksCollection
      .find({ bookId: { $in: bookIds } })
      .toArray();

    return NextResponse.json(
      {
        wishlistId: wishlistDoc?._id || null,
        books,
      },
      { status: 200 }
    );
  } catch (error) {
    // // console.error("getBooksByIds error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
