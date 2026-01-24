


import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { en, bn, subcategories } = body;



    const db = await connectDb();

    const result = await db.collection("categories").insertOne({
      en,
      bn,
      subcategories: subcategories || [], // save empty if none
    });

    return NextResponse.json(
      { message: "Category added", _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
