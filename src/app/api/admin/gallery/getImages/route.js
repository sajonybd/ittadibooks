import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await connectDb();
    const images = await db.collection("galleryImages").find({}).sort({ uploadedAt: -1 }).toArray();
    return NextResponse.json({ images });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
