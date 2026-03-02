import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const db = await connectDb();
    const cart = await db.collection("cart").findOne({ userEmail: email });
    const count = cart?.bookIds?.length || 0;

    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
