import { connectDb } from "@/lib/connectDb";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = await request.json();
    if (!bookId) {
      return NextResponse.json({ error: "Missing book ID" }, { status: 400 });
    }

    const db = await connectDb();
    const cartCollection = db.collection("cart");

    // Add bookId to cart array only if not present
    await cartCollection.updateOne(
      { userEmail: token.email },
      { $addToSet: { bookIds: bookId } },
      { upsert: true }
    );

    return NextResponse.json({ message: "Book added to cart" });
  } catch (error) {
    // // // console.error("Cart add error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
