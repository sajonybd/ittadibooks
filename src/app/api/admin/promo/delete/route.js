import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import { ObjectId } from "mongodb";

export async function DELETE(req) {
  try {
    const db = await connectDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await db.collection("promoCodes").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Promo code deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete promo code" }, { status: 500 });
  }
}
