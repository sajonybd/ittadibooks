

import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {

    const params = await context.params; // unwrap if Promise
    const { id } = params;

    // Decode the URL parameter
    const nameFromUrl = decodeURIComponent(id).trim().toLowerCase();

    const db = await connectDb();

    // Fetch all categories
    const categories = await db.collection("categories").find({}).toArray();

    const category = categories.find(cat => {
      if (!cat.en) return false;

      // Only split if name contains '/'
      const firstPart = cat.en.includes('/')
        ? cat.en.split('/')[0].trim().toLowerCase()
        : cat.en.trim().toLowerCase();

      return firstPart === nameFromUrl;
    });

    if (!category) {
      return NextResponse.json(
        { message: "category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category, { status: 200 });
  } catch (err) {
    // // console.error("Error fetching category:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
