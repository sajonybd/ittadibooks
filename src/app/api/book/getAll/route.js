import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
 

export async function GET() {
  try {
    const db = await connectDb();
    const books = await db.collection("books").find().toArray();

    if (!books) {
      return NextResponse.json({ error: "Books not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, books });
  } catch (error) {
    // // // console.error("Error fetching book detail:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
