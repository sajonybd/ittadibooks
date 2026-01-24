import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";

export async function GET() {
  try {
    const db = await connectDb();
    const blogs = await db.collection("posts").find({}).toArray();

    // Convert _id to string
    const formatted = blogs.map((b) => ({
      _id: b._id.toString(),
      title: b.title,
      html: b.html,
      createdAt: b.createdAt,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    // // console.error("❌ Fetch blogs error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
