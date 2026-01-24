import { connectDb } from "@/lib/connectDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectDb();

    const users = await db.collection("users")
      .find({})
      .project({ password: 0 })  
      .toArray();

    return NextResponse.json({ success: true, users });
  } catch (error) {
    // // // console.error("Get users error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
