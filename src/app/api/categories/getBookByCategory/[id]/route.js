 


import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const name = decodeURIComponent(
      Array.isArray(params.id) ? params.id.join("/") : params.id
    ).trim(); // trim just in case


    const db = await connectDb();
    const books = await db
      .collection("books")
      .find({ "categories.category": name })
      .toArray();

    if (!books || books.length === 0) {
      return NextResponse.json({ message: "books not found" }, { status: 404 });
    }

    return NextResponse.json(books, { status: 200 });
  } catch (err) {
    // // console.error("Error fetching books:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
