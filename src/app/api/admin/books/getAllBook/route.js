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

    const books = await db
      .collection("books")
      .find(
        {},
        {
          projection: {
            title: 1,
            cover:1,
            bookId: 1,
            publisher:1,
            authors:1,
            authorBn:1,
            price:1,
            collections:1,
            categories: 1,
            discount: 1,
            discountedPrice: 1,
          },
        }
      )
      .toArray();

    return NextResponse.json({ success: true, books });
  } catch (error) {
    // // // console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
