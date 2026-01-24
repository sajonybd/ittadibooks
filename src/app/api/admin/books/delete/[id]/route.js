import { connectDb } from "@/lib/connectDb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    const db = await connectDb();
    const bookId = params.id;

    const result = await db.collection("books").deleteOne({ _id: new ObjectId(bookId) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // // // console.error("Delete Book Error:", error);
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
