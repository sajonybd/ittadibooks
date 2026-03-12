import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await connectDb();

    const categories = await db
      .collection("categories")
      .find({}, { projection: { _id: 1, bn: 1, en: 1, slug: 1 } })
      .sort({ bn: 1 })
      .toArray();

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    // // // console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
