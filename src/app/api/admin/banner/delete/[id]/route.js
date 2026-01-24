import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import { ObjectId } from "mongodb";

export async function DELETE(req, context) {
  const params = await context.params; // unwrap if Promise
  const { id } = params;

  try {
    const db = await connectDb();
    const result = await db.collection("banners").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true, message: "Banner deleted" });
    } else {
      return NextResponse.json({ success: false, message: "Banner not found" }, { status: 404 });
    }
  } catch (error) {
    // // // console.error("Failed to delete banner:", error);
    return NextResponse.json({ success: false, message: "Failed to delete banner" }, { status: 500 });
  }
}
