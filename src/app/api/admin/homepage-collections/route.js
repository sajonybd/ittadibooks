import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function GET() {
  const db = await connectDb();
  const data = await db.collection("homepageCollections").findOne({ _id: "homepageCollections" });
  return NextResponse.json(data || {});
}
