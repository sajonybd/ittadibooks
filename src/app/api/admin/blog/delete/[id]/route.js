import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import { ObjectId } from "mongodb";

export async function DELETE(req, context) {
  try {
    const params = await context.params; // unwrap if Promise
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }

    const db = await connectDb();
    const result = await db.collection("posts").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    // // console.error("❌ Delete blog error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
