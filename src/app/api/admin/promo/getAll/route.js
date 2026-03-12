import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectDb();
    const promoCodes = await db.collection("promoCodes").find({}).toArray();
    return NextResponse.json({ promoCodes });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch promo codes" }, { status: 500 });
  }
}
