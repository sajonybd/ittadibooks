import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectDb } from "@/lib/connectDb";

export async function POST(req) {
  try {
    const db = await connectDb();
    const { ids, discount } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No book IDs provided" },
        { status: 400 }
      );
    }

    const discountValue = parseFloat(discount);
    if (isNaN(discountValue) || discountValue < 0) {
      return NextResponse.json(
        { error: "Invalid discount value" },
        { status: 400 }
      );
    }

    // Fetch the selected books to calculate discountedPrice
    const books = await db
      .collection("books")
      .find({ _id: { $in: ids.map((id) => new ObjectId(id)) } })
      .toArray();

    if (!books || books.length === 0) {
      return NextResponse.json(
        { error: "No matching books found" },
        { status: 404 }
      );
    }

    // Update each book with new discount & discountedPrice
    const bulkOps = books.map((book) => {
      const price = parseFloat(book.price || 0);
      const discountedPrice = price - (price * discountValue) / 100;

      return {
        updateOne: {
          filter: { _id: book._id },
          update: {
            $set: {
              discount: discountValue,
              discountedPrice: Math.round(discountedPrice),
            },
          },
        },
      };
    });

    await db.collection("books").bulkWrite(bulkOps);

    return NextResponse.json({ success: true, updated: books.length });
  } catch (error) {
    // // console.error("Bulk discount error:", error);
    return NextResponse.json(
      { error: "Failed to apply bulk discount" },
      { status: 500 }
    );
  }
}
