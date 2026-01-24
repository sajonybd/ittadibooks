 


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

    const { bookId } = await request.json();

    if (!bookId) {
      return NextResponse.json({ error: "Missing book ID" }, { status: 400 });
    }

    const db = await connectDb();
    const wishlistCollection = db.collection("wishlist");

    // remove bookId (as string for safety)
    const result = await wishlistCollection.updateOne(
      { userEmail: token.email },
      { $pull: { bookIds: String(bookId) } }
    );

    // get updated wishlist
    const updatedWishlist = await wishlistCollection.findOne({ userEmail: token.email });

    return NextResponse.json({
      message:
        result.modifiedCount > 0
          ? "Book removed from wishlist"
          : "Book not found in wishlist",
      wishlist: updatedWishlist?.bookIds || [],
    });
  } catch (error) {
    // // console.error("Wishlist remove error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
