import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import { ObjectId } from "mongodb";

export async function GET(req, context) {
  try {

    const params = await context.params; // unwrap if Promise
    const { id } = params;
    const db = await connectDb();

    const blog = await db.collection("posts").findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    // // console.error("❌ Fetch blog error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
