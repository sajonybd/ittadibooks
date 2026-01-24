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

    // Remove bookId from user's cart
    await cartCollection.updateOne(
      { userEmail: token.email },
      { $pull: { bookIds: bookId } }
    );

    return NextResponse.json({ message: "Book removed from cart" });
  } catch (error) {
    // // // console.error("Cart remove error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
