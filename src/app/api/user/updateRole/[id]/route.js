 
import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PUT(req, context) {
  const params = await context.params; // unwrap if Promise
  const { id } = params;
  const { role } = await req.json();

  if (!role) {
    return NextResponse.json({ error: "Missing role" }, { status: 400 });
  }

  try {
    const db = await connectDb();
    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: { role } });

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "User not found or unchanged" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
