import { connectDb } from "@/lib/connectDb";
 
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