import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

// GET route to count wishlist items by email
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const db = await connectDb();
    const wishlist = await db
      .collection("wishlist")
      .findOne({ userEmail: email });

    const count = wishlist?.bookIds?.length || 0;

    return NextResponse.json({ count });
  } catch (error) {
    // // // console.error("Wishlist count error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
