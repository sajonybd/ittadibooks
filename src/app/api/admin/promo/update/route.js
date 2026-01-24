import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import { ObjectId } from "mongodb";

export async function PATCH(req) {
  try {
    const db = await connectDb();
    const data = await req.json();

    if (!data.id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const updateData = { ...data };
    delete updateData.id;

    await db
      .collection("promoCodes")
      .updateOne({ _id: new ObjectId(data.id) }, { $set: updateData });

    return NextResponse.json({ message: "Promo code updated" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update promo code" }, { status: 500 });
  }
}
