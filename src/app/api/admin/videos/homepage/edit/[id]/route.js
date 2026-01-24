import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import { ObjectId } from "mongodb";

// PUT update video
export async function PUT(req, context) {
  try {

    const params = await context.params; // unwrap if Promise
    const { id } = params;
    const { title, url } = await req.json();

    const db = await connectDb();
    const result = await db.collection("videoshomepage").updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, url } }
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update video" },
      { status: 500 }
    );
  }
}

// DELETE video
export async function DELETE(req, context) {
  try {
    const params = await context.params; // unwrap if Promise
    const { id } = params;
    const db = await connectDb();
    const result = await db
      .collection("videoshomepage")
      .deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete video" },
      { status: 500 }
    );
  }
}
