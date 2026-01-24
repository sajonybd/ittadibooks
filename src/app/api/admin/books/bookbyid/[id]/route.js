import { NextResponse } from "next/server";
 
import { connectDb } from "@/lib/connectDb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const  db = await connectDb()
    const bookId = params.id;

    const book = await db.collection("books").findOne({ _id: new ObjectId(bookId) });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    // // // console.error(error);
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 });
  }
}
