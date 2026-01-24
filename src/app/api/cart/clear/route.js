import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDb } from "@/lib/connectDb";

export async function DELETE(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await connectDb();

    const result = await db.collection("cart").deleteOne({
      userEmail: session.user.email,
    });

    return NextResponse.json(
      { success: true, deletedCount: result.deletedCount },
      { status: 200 }
    );
  } catch (error) {
    // // // console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Server error while clearing cart." },
      { status: 500 }
    );
  }
}
