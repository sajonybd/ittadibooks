


import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// PUT /api/admin/categories/[id]
export async function PUT(req, context) {
  try {
    const params = await context.params; // unwrap if Promise
  const { id } = params;
    
    const body = await req.json();
    const { en, bn, subcategories } = body; // include subcategories

   

    const db = await connectDb();
    const result = await db
      .collection("categories")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { en, bn, subcategories: subcategories || [] } } // update subcategories
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Category updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    // // console.error("Error updating category:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// GET /api/admin/categories/[id] → for fetching single category
export async function GET(req, context) {
  try {
    const params = await context.params;  
    const { id } = params;
    const db = await connectDb();
    const category = await db
      .collection("categories")
      .findOne({ _id: new ObjectId(id) });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    // // console.error("Error fetching category:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
