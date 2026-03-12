import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await connectDb();

    const authors = await db
      .collection("authors")
      .find({}, { projection: { _id: 0, name: 1, nameBn: 1 } })
      .sort({ nameBn: 1 })
      .toArray();

    return NextResponse.json({ success: true, authors });
  } catch (error) {
    // // // console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
