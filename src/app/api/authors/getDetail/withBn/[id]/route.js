 


import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
     const params = await context.params;
    const encodedName = params.id;
    const name = decodeURIComponent(encodedName).trim(); // remove extra spaces

    const db = await connectDb();

    // Fetch all authors and find manually (ensures no space mismatch)
    const authors = await db.collection("authors").find({}).toArray();

    // Compare trimmed names to avoid mismatch from trailing spaces in DB
    const author = authors.find(
      (a) => a.nameBn?.trim() === name
    );

    if (!author) {
      return NextResponse.json(
        { message: "Author not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(author, { status: 200 });
  } catch (err) {
    // // console.error("Error fetching author:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
