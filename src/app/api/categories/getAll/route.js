import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const db = await connectDb();
    const categories = await db
      .collection("categories")
      .find({}, { projection: { _id: 0, bn: 1, en: 1, slug: 1 } })
      .sort({ bn: 1 })
      .toArray();

    return NextResponse.json(categories || [], { status: 200 });
  } catch (err) {
    // // // console.error("Error fetching categories:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
