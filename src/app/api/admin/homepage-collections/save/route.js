import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { collectionId, selectedBooks } = body;

  const db = await connectDb();
  await db.collection("homepageCollections").updateOne(
    { _id: "homepageCollections" },
    { $set: { [`collections.${collectionId}`]: selectedBooks, updatedAt: new Date() } },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}
