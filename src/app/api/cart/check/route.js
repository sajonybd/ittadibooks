import { connectDb } from "@/lib/connectDb";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const bookId = url.searchParams.get("bookId");

    if (!bookId) {
      return NextResponse.json({ error: "Missing book ID" }, { status: 400 });
    }

    const db = await connectDb();
    const cartCollection = db.collection("cart");

    const cart = await cartCollection.findOne({ userEmail: token.email, bookIds: bookId });

    return NextResponse.json({ inCart: !!cart });
  } catch (error) {
    // // // console.error("Cart check error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
