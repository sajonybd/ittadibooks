import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";

export async function GET() {
  try {
    const db = await connectDb();
    const banners = await db.collection("banners").find({}).sort({ uploadedAt: -1 }).toArray();

    return NextResponse.json({ success: true, banners });
  } catch (error) {
    // // // console.error("Failed to fetch banners:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch banners" }, { status: 500 });
  }
}
