import { connectDb } from "@/lib/connectDb";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// 🔹 Get current notice
export async function GET() {
  try {
    const db = await connectDb();
    const noticeCollection = db.collection("notice");

    const notice = await noticeCollection.findOne({});
    return NextResponse.json(notice || {});
  } catch (error) {
    // // console.error("GET /api/notice error:", error);
    return NextResponse.json({ error: "Failed to fetch notice" }, { status: 500 });
  }
}

// 🔹 Create or update notice (Admin only)
export async function POST(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await request.json();
    if (!message || message.trim() === "") {
      return NextResponse.json({ error: "Notice message required" }, { status: 400 });
    }

    const db = await connectDb();
    const noticeCollection = db.collection("notice");

    // check if a notice already exists
    const existing = await noticeCollection.findOne({});
    if (existing) {
      await noticeCollection.updateOne({}, { $set: { message } });
    } else {
      await noticeCollection.insertOne({ message });
    }

    return NextResponse.json({ success: true, message: "Notice updated successfully" });
  } catch (error) {
    // // console.error("POST /api/notice error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
