import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";

// GET all videos
export async function GET() {
  try {
    const db = await connectDb();
    const videos = await db
      .collection("videoshomepage")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, videos });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
