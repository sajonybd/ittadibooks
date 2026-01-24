import { connectDb } from "@/lib/connectDb";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from "next/server";

export async function GET() {
  try {
   

    const db = await connectDb();

    const categories = await db.collection("categories").find().toArray();

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    // // // console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
