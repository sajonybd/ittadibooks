import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import { ObjectId } from "mongodb";

export async function DELETE(req, context) {
  const params = await context.params; // unwrap if Promise
  const { id } = params;

  try {
    const db = await connectDb();
    const authorsCollection = db.collection("authors");

    const result = await authorsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: "Author not found" });
    }
  } catch (error) {
    // // console.error("Delete author error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
