


import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";

export async function POST(req) {
  try {
    const db = await connectDb();
    const body = await req.json();

    const { name, email, rating, comment, bookId } = body;

    if (!name || !rating || !comment || !bookId) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const reviewData = {
      name,
      email: email || "",
      rating: Number(rating),
      comment,
      bookId,
      createdAt: new Date(),
    };

    const result = await db.collection("reviews").insertOne(reviewData);

    //  Return the inserted review directly
    return NextResponse.json({
      success: true,
      review: { ...reviewData, _id: result.insertedId },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to add review" },
      { status: 500 }
    );
  }
}
