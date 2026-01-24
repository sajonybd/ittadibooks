import { connectDb } from "@/lib/connectDb";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = await request.json();

    if (!bookId) {
      return NextResponse.json({ error: "Missing book ID" }, { status: 400 });
    }

    const db = await connectDb();
    const wishlistCollection = db.collection("wishlist");

    // Add bookId to wishlist array only if it's not already present
    const result = await wishlistCollection.updateOne(
      { userEmail: token.email },
      { $addToSet: { bookIds: bookId } }, // $addToSet avoids duplicates
      { upsert: true }
    );

    return NextResponse.json({ message: "Book added to wishlist" });
  } catch (error) {
    // // // console.error("Wishlist add error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
