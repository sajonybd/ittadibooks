import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDb } from "@/lib/connectDb";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await connectDb();

    const orders = await db
      .collection("orders")
      .find({ email: session.user.email })
      .sort({ createdAt: -1 }) // Optional: latest orders first
      .toArray();

    return NextResponse.json({ orders });
  } catch (error) {
    // // // console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Server error while fetching orders" },
      { status: 500 }
    );
  }
}
