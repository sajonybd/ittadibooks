import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const db = await connectDb();
    const categories = await db.collection("categories").find().toArray();

    if (!categories || categories.length === 0) {
      return NextResponse.json(
        { message: "categories not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(categories, { status: 200 });
  } catch (err) {
    // // // console.error("Error fetching categories:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
