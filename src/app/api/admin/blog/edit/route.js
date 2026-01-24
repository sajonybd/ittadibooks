import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { id, title, html } = await req.json();

    if (!id || !title || !html) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await connectDb();

    const result = await db.collection("posts").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          html,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Blog updated successfully" });
  } catch (error) {
    // // console.error("Blog Edit Error:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}
