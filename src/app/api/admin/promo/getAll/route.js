 
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";

export async function GET() {
  try {
    const db = await connectDb();
    const promoCodes = await db.collection("promoCodes").find({}).toArray();
    return NextResponse.json({ promoCodes });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch promo codes" }, { status: 500 });
  }
}
