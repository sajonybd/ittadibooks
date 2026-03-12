import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";

export async function GET(req) {
  try {
    const db = await connectDb();
    const { searchParams } = new URL(req.url);
    const collectionName = searchParams.get("collection");

    if (!collectionName) {
      return NextResponse.json(
        { success: false, message: "Collection parameter is required" },
        { status: 400 }
      );
    }

    

    const books = await db
      .collection("books")
      .find(
        { "collections.value": collectionName },
        {
          projection: {
            _id: 1,
            bookId: 1,
            title: 1,
            cover: 1,
            discountedPrice: 1,
            price: 1,
            authors: 1,
            inStock: 1,
            isEbook: 1,
            createdAt: 1,
          },
        }
      )
      .sort({ createdAt: -1 })
      .limit(12)
      .toArray();

    return NextResponse.json({ success: true, books });
  } catch (error) {
    // // // console.error("Failed to fetch books by collection:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch books" },
      { status: 500 }
    );
  }
}
