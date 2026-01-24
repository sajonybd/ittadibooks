
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import { ObjectId } from "mongodb";

export async function GET(req, context) {
  const params = await context.params; // unwrap if Promise
  const { id } = params;

 

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
  }

  try {
    const db = await connectDb();
    const book = await db.collection("books").findOne({ _id: new ObjectId(id) });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, book });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

