 

import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const englishName = searchParams.get("category")?.trim(); // English name from query

    if (!englishName) {
      return NextResponse.json(
        { message: "Category not provided" },
        { status: 400 }
      );
    }

    const db = await connectDb();

    // Step 1: Find the Bengali name from categories collection
    const categoryDoc = await db
      .collection("categories")
      .findOne({ en: englishName }); // assuming your categories collection has { en: "...", bn: "..." }


       
    if (!categoryDoc || !categoryDoc.bn) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    const bnName = categoryDoc.bn;
   

    

    const books = await db
      .collection("books")
      .find({
        "categories.category": bnName
      })
      .toArray();
 


    if (!books || books.length === 0) {
      return NextResponse.json({ message: "books not found" }, { status: 404 });
    }

    return NextResponse.json(books, { status: 200 });
  } catch (err) {
    // // console.error("Error fetching books:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
