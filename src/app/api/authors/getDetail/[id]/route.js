import { connectDb } from "@/lib/connectDb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    // const { id } = params;
    const params = await context.params; // unwrap if Promise
    const encodedName = params.id;
    const name = decodeURIComponent(encodedName);
    const db = await connectDb();
    const author = await db.collection("authors").findOne({ name: name });

    if (!author) {
      return NextResponse.json(
        { message: "Author not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(author, { status: 200 });
  } catch (err) {
    // // // console.error("Error fetching author:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
