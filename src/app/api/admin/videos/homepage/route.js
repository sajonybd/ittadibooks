import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import { ObjectId } from "mongodb";

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

// POST add a video
export async function POST(req) {
  try {
    const { title, url } = await req.json();
    if (!title || !url) {
      return NextResponse.json(
        { success: false, message: "Title & URL required" },
        { status: 400 }
      );
    }

    const db = await connectDb();
    const result = await db.collection("videoshomepage").insertOne({
      title,
      url,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to add video" },
      { status: 500 }
    );
  }
}
